// js/chatbot.js
(function(){
  const LS = {
    name: 'jb_user_name',
    prefs: 'jb_prefs',
    queries: 'jb_recent_queries',
    cart: 'jb_cart',
    dailyPrefix: 'jb_daily_joke_',
    sessions: 'jb_sessions_count',
    cartTotal: 'jb_cart_total'
  };

  // State
  const state = {
    tone: 'warm', // warm | neutral | professional
    name: load(LS.name) || null,
    prefs: safeJSON(load(LS.prefs)) || { tone: 'warm' },
    queries: safeJSON(load(LS.queries)) || [],
    cart: safeJSON(load(LS.cart)) || [],
    sessions: parseInt(load(LS.sessions) || '0', 10),
    lastSeen: parseInt(sessionStorage.getItem('jb_last_seen') || '0', 10)
  };

  // Utilities
  function load(k){ try{ return localStorage.getItem(k) }catch(e){ return null } }
  function save(k,v){ try{ localStorage.setItem(k, v) }catch(e){} }
  function safeJSON(s){ try{ return JSON.parse(s) }catch(e){ return null } }
  function pushQuery(q){
    state.queries.unshift({ q, t: Date.now() });
    state.queries = state.queries.slice(0, 20);
    save(LS.queries, JSON.stringify(state.queries));
  }
  function setTone(t){ state.tone = t; updateToneUI(t); save(LS.prefs, JSON.stringify({ ...state.prefs, tone: t })); }
  function priceFmt(n){ return `${n} Fbu`; }

  // Sentiment detection
  function detectSentiment(text){
    const t = text.toLowerCase();
    const empathyKeys = ["ndahangayitse","ikibazo","sinzi uko","birandenze"];
    const joyKeys = ["ndishimye","ni byiza","urakoze","ndanezerewe"];
    if (empathyKeys.some(k => t.includes(k))) return 'empathy';
    if (joyKeys.some(k => t.includes(k))) return 'joy';
    return 'neutral';
  }

  // Tone selection based on prefs or message
  function adaptTone(text){
    const s = detectSentiment(text);
    if (s === 'empathy') setTone('warm');
    else if (s === 'joy') setTone('warm');
    else setTone(state.prefs.tone || 'neutral');
  }

  // Greeting by profile name
  function greet(){
    const name = state.name ? `, ${state.name}` : '';
    const comeback = shouldNudge();
    let msg = `Muraho${name}! Ndakufasha gushakisha stock yawe. Andika: “amakuru” cyangwa “ndashaka amata”.`;
    if (comeback) msg += ` Twaragukumbuye! Dufise promo yoroheje kuri uyu munsi 🌸`;
    speak(msg);
  }

  function shouldNudge(){
    const last = parseInt(load('jb_last_visit') || '0', 10);
    const now = Date.now();
    const days = last ? (now - last) / (1000*60*60*24) : 0;
    const nud = days >= 3;
    save('jb_last_visit', String(now));
    return nud;
  }

  // Speak with emojis per sentiment/tone
  function speak(text, sentiment){
    const wnd = document.getElementById('chatWindow');
    const div = document.createElement('div');
    div.className = 'msg assistant';
    const b = document.createElement('div');
    b.className = 'bubble assistant';
    const emoji = sentiment === 'empathy' ? '💙' : sentiment === 'joy' ? '🎉' : '';
    b.textContent = emoji ? `${emoji} ${text}` : text; // safe: no HTML injection
    div.appendChild(b);
    wnd.appendChild(div);
    wnd.scrollTop = wnd.scrollHeight;
  }

  function echoUser(text){
    const wnd = document.getElementById('chatWindow');
    const div = document.createElement('div');
    div.className = 'msg';
    const b = document.createElement('div');
    b.className = 'bubble user';
    b.textContent = text; // sanitize: textContent only
    div.appendChild(b);
    wnd.appendChild(div);
    wnd.scrollTop = wnd.scrollHeight;
  }

  // Commands
  function handleCommand(text){
    const t = text.trim();
    pushQuery(t);
    adaptTone(t);
    const sentiment = detectSentiment(t);

    // Profile: set name → "izina [Name]" (optional helper)
    if (t.toLowerCase().startsWith('izina ')){
      const name = t.slice(6).trim();
      if (name){
        state.name = name;
        save(LS.name, name);
        speak(`Nezako, ${name}. Ndabika izina ryawe kugira nsuhuze neza.`, sentiment);
        updateAssistantName();
        return;
      }
    }

    // Tone preference: "tone warm|neutral|professional"
    if (t.toLowerCase().startsWith('tone ')){
      const val = t.slice(5).trim().toLowerCase();
      if (['warm','neutral','professional'].includes(val)){
        setTone(val);
        speak(`Tone yahinduwe: ${val}.`, sentiment);
        return;
      }
    }

    // Daily tip/joke: "amakuru"
    if (t.toLowerCase() === 'amakuru'){
      const joke = dailyJoke();
      speak(`Joke y’umunsi: ${joke}`, 'joy');
      return;
    }

    // Queries
    if (t.toLowerCase().includes('ndashaka amata')) {
      const res = searchProducts({ nameIncludes: 'amata', category: 'amata' });
      renderResults(res);
      return;
    }
    if (t.toLowerCase() === 'ibinyobwa') {
      const res = searchProducts({ category: 'Ibinyobwa' });
      renderResults(res);
      return;
    }
    if (t.toLowerCase().includes('munsi ya')) {
      const n = parseInt(t.replace(/\D+/g,''), 10);
      const res = JB_PRODUCTS.filter(p => p.price < n);
      renderResults(res);
      return;
    }

    // Cart commands
    if (t.toLowerCase().startsWith('fata bundle ')){
      const name = t.slice('fata bundle '.length).trim();
      addBundle(name);
      return;
    }
    if (t.toLowerCase().startsWith('fata ')){
      const id = parseInt(t.slice(5).trim(), 10);
      addToCart(id);
      return;
    }
    if (t.toLowerCase() === 'checkout'){
      checkout();
      return;
    }

    // Sentiment short replies
    if (sentiment === 'empathy'){
      speak('Ndakumva. Tugire buhoro buhoro, ndagufasha kubona ibisubizo 💙', 'empathy');
      return;
    }
    if (sentiment === 'joy'){
      speak('Ndanezerewe ko vyagenze neza! Wipfuje igitekerezo gishasha? 🎉', 'joy');
      return;
    }

    // Default
    speak('Andika: “amakuru”, “ndashaka amata”, “Ibinyobwa”, “munsi ya 2000”, “fata 3”, “checkout”.');
  }

  // Search core
  function searchProducts({ nameIncludes, category }){
    const txt = (nameIncludes || '').toLowerCase();
    let list = JB_PRODUCTS;
    if (category) list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
    if (txt) list = list.filter(p => p.name.toLowerCase().includes(txt));
    return list;
  }

  // Render search results (readable format)
  function renderResults(items){
    if (!items.length){ speak('Nta bicuruzwa bibonetse kuri ayo mabwirizwa.', 'empathy'); return; }
    const wnd = document.getElementById('chatWindow');
    const wrap = document.createElement('div');
    wrap.className = 'msg assistant';
    const bubble = document.createElement('div');
    bubble.className = 'bubble assistant';
    const lines = items.map(p => `#${p.id} — ${p.name} | ${priceFmt(p.price)} | stock: ${p.stock} | ${p.desc}`);
    bubble.textContent = `Ibisubizo:\n${lines.join('\n')}`;
    wrap.appendChild(bubble);
    wnd.appendChild(wrap);
    wnd.scrollTop = wnd.scrollHeight;

    // Also highlight products in grid
    highlightProducts(items.map(p => p.id));
  }

  // Cart
  function addToCart(id){
    const item = JB_PRODUCTS.find(p => p.id === id);
    if (!item){ speak('ID watanze ntibaho.', 'empathy'); return; }
    state.cart.push({ id: item.id, name: item.name, price: item.price, qty: 1 });
    save(LS.cart, JSON.stringify(state.cart));
    updateCartTotals();
    speak(`Oke! Onyoyeje mu igare: #${item.id} — ${item.name} 🛒`, 'joy');
  }

  function addBundle(name){
    const b = JB_BUNDLES[name];
    if (!b){ speak('Bundle wifuza ntibaho.', 'empathy'); return; }
    b.ids.forEach(id => {
      const item = JB_PRODUCTS.find(p => p.id === id);
      if (item) state.cart.push({ id: item.id, name: item.name, price: item.price, qty: 1 });
    });
    // Apply bundle price by setting effective total
    save(LS.cart, JSON.stringify(state.cart));
    updateCartTotals();
    speak(`Bundle "${name}" yongewe mu igare 🛒`, 'joy');
  }

  function updateCartTotals(){
    const subtotal = state.cart.reduce((s, c) => s + (c.price * c.qty), 0);
    save(LS.cartTotal, String(subtotal));
    state.sessions += 1;
    save(LS.sessions, String(state.sessions));
  }

  function discountIfEligible(subtotal){
    const sessions = parseInt(load(LS.sessions) || '0', 10);
    const cartTotal = parseInt(load(LS.cartTotal) || '0', 10);
    if (sessions >= 5 && cartTotal >= 5000){
      const rate = 0.05 + Math.random()*0.02; // 5–7%
      const disc = Math.round(subtotal * rate);
      return { rate: Math.round(rate*100), amount: disc };
    }
    return null;
  }

  function checkout(){
    if (!state.cart.length){ speak('Igare ririmo ubusa.', 'empathy'); return; }
    const subtotal = state.cart.reduce((s, c) => s + (c.price * c.qty), 0);
    const tax = 0; // adjust if needed
    const promo = discountIfEligible(subtotal);
    const total = subtotal + tax - (promo ? promo.amount : 0);
    const lines = state.cart.map(c => `#${c.id} ${c.name} x${c.qty} — ${priceFmt(c.price*c.qty)}`);
    let txt = `Invoice:\n${lines.join('\n')}\nSubtotal: ${priceFmt(subtotal)}\nTaxes: ${priceFmt(tax)}\nTotal: ${priceFmt(total)}`;
    if (promo) txt += `\nDiscount: ${promo.rate}% — ${priceFmt(promo.amount)}`;
    speak(txt);

    // CTA: WhatsApp + contact form note
    speak('Ushaka kurangiza? Kanda WhatsApp hejuru cyangwa ukoreshe Contact form 💌');
  }

  // Daily Joke (unique per day)
  function todayKey(){
    const d = new Date();
    const key = `${LS.dailyPrefix}${d.getFullYear()}_${String(d.getMonth()+1).padStart(2,'0')}_${String(d.getDate()).padStart(2,'0')}`;
    return key;
  }
  function dailyJoke(){
    const k = todayKey();
    const existing = load(k);
    if (existing) return existing;
    const pool = JB_JOKES_RW;
    const joke = pool[Math.floor(Math.random()*pool.length)];
    save(k, joke);
    return joke;
  }

  // UI integration
  function updateAssistantName(){
    const el = document.getElementById('assistantName');
    el.textContent = state.name ? `Assistant ya ${state.name}` : 'Assistant';
  }
  function updateToneUI(t){
    const el = document.getElementById('assistantTone');
    el.textContent = `Tone: ${t}`;
  }

  // Highlight products in grid when searched
  function highlightProducts(ids){
    document.querySelectorAll('.product').forEach(card => {
      const id = parseInt(card.dataset.id, 10);
      card.style.outline = ids.includes(id) ? '2px solid var(--accent)' : 'none';
    });
  }

  // Public init
  window.JB_CHATBOT = {
    init(){
      updateAssistantName();
      updateToneUI(state.tone);
      greet();
    },
    handleCommand
  };
})();
