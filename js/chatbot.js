// === Chatbot Pro Assistant ===

// Elements
const chatWindow = document.getElementById('chatWindow');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');

// Memory
let userName = localStorage.getItem('jb_user_name') || null;
let cart = JSON.parse(localStorage.getItem('jb_cart') || '[]');
let sessions = parseInt(localStorage.getItem('jb_sessions_count') || '0');
let currentMode = localStorage.getItem('jb_mode') || "formal";
let romanticTone = localStorage.getItem('jb_romantic') === "true";

sessions++;
localStorage.setItem('jb_sessions_count', sessions);

// Female names list
const FEMALE_NAMES = ["aline","chantal","divine","gloria","sandrine","diane","florence","claudine","esther","marie","alice","sandra","chloe","sarah","nadine"];

// Vocabulary banks
const VOCAB_FORMAL = {
  greetings: ["N’amahoro yawe?", "Bite neza?", "N’amakuru yawe?"],
  thanks: ["Urakoze cane", "Ndabashimiye", "Merci cane"],
  confirmations: ["Yego", "Ni vyo", "Nta kibazo"],
  empathy: ["Komera cane", "Humura, vyose bizokunda", "Ndakumva neza"]
};

const VOCAB_SLANG = {
  greetings: ["Bite sha 🌸","N’amahoro boss? 🙌","N’amakuru mugenzi?","Bite chérie 💖","N’amahoro chief?"],
  thanks: ["Urakoze cane 🙏","Merci sha 🌸","Big up boss 💪","Respect mugenzi 👊","Blessings 💫"],
  confirmations: ["Yego kabisa 🔥","Ndabizi neza 💯","Nta kibazo sha 😉","Vyiza cane 🌟","Oya sha, nta stress ✌️"],
  empathy: ["Komera cane 💙","Humura sha, ntaco bizoba 🙏","Vy’ukuri ndakumva 🌸","Courage mugenzi 💪","Bizokunda sha, trust me 😉"]
};

// Helpers
function randomFrom(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function vocab(key){
  const bank = currentMode === "slang" ? VOCAB_SLANG : VOCAB_FORMAL;
  return randomFrom(bank[key]);
}

// Render message
function renderMessage(sender, text) {
  const msg = document.createElement('div');
  msg.className = sender;
  msg.innerHTML = text;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Bot reply with typing delay
function botReply(text) {
  setTimeout(() => renderMessage('bot', text), 500);
}

// Ask name if not known
function askNameIfNeeded() {
  botReply("Ndakwinginze sha 🌸, nitwa JeuneBot. Wowe witwa gute?");
}

// === Cart functions ===
function addToCart(id) {
  const item = JB_PRODUCTS.find(p => p.id == id);
  if (!item) return botReply("Nta product ifite ID iyo ibonetse 🌸");
  cart.push({ id: item.id, name: item.name, price: item.price, qty: 1 });
  localStorage.setItem('jb_cart', JSON.stringify(cart));
  botReply(`💖 Ongereje <b>${item.name}</b> mu igare ryawe 🛒`);
}

function showCart() {
  if (cart.length === 0) return botReply("Igare ryawe riracyari ubusa 🛒");
  let total = 0;
  let lines = cart.map(c => {
    total += c.price * c.qty;
    return `${c.qty} × ${c.name} (${c.price} Fbu)`;
  });
  let discount = (sessions >= 5 && total >= 5000) ? Math.round(total * 0.07) : 0;
  let final = total - discount;

  if(romanticTone){
    botReply(`
      🧾 Sha ${userName} chérie 💕, invoice yawe:<br>
      ${lines.join('<br>')}<br>
      Total: <b>${total} Fbu</b><br>
      Discount: <b>${discount} Fbu</b><br>
      <b>Final: ${final} Fbu</b> 🌹
    `);
  } else {
    botReply(`
      🧾 Invoice yawe:<br>
      ${lines.join('<br>')}<br>
      Total: <b>${total} Fbu</b><br>
      Discount: <b>${discount} Fbu</b><br>
      <b>Final: ${final} Fbu</b> 🌸
    `);
  }
}

// === Render results with images + highlight ===
function renderResults(items, keyword){
  if (!items.length){
    return botReply(`Nta bicuruzwa bibonetse kuri "${keyword}" 🌸`);
  }

  function highlight(text, kw){
    if(!kw) return text;
    const regex = new RegExp(`(${kw})`, "gi");
    return text.replace(regex, `<mark style="background:#ff6ec7;color:#fff;border-radius:3px;padding:0 2px;">$1</mark>`);
  }

  items.forEach(p => {
    const msg = `
      <div style="display:flex;align-items:center;gap:10px;">
        <img src="${p.image}" alt="${p.name}" 
             style="width:60px;height:60px;object-fit:cover;border-radius:8px;">
        <div>
          <b>#${p.id} — ${highlight(p.name, keyword)}</b><br>
          ${p.price} Fbu | stock: ${p.stock}<br>
          <small>${highlight(p.desc, keyword)}</small>
        </div>
      </div>
    `;
    botReply(msg);
  });
}

// === Handle messages ===
function handleMessage(msg){
  const lower = msg.toLowerCase();

  // Mode switching
  if(lower.startsWith("mode ")){
    const mode = lower.split(" ")[1];
    if(mode === "slang" || mode === "formal"){
      currentMode = mode;
      localStorage.setItem('jb_mode', mode);
      return botReply(`Mode yahindutse: <b>${mode.toUpperCase()}</b> ✅`);
    }
  }

  // Name capture
  if(lower.startsWith("nitwa ") || lower.startsWith("ndi ")){
    userName = msg.replace(/nitwa|ndi/gi,"").trim();
    localStorage.setItem('jb_user_name', userName);

    // Check if feminine
    if(FEMALE_NAMES.some(n => userName.toLowerCase().includes(n))){
      romanticTone = true;
      localStorage.setItem('jb_romantic', "true");
    } else {
      romanticTone = false;
      localStorage.setItem('jb_romantic', "false");
    }

    return botReply(`Nishimiye kukumenya ${userName} 💖`);
  }

  // Greetings
  if(lower.includes("amakuru")){
    if(!userName) return askNameIfNeeded();
    if(romanticTone){
      return botReply(`Bite ${userName} 💕, ndakubona nk’umukiriya wihariye cane 🌹`);
    } else {
      return botReply(`${vocab("greetings")} ${userName || ""}`);
    }
  }

  // Thanks
  if(lower.includes("urakoze")){
    return botReply(vocab("thanks"));
  }

  // Confirmations
  if(lower.includes("ego") || lower.includes("yego")){
    return botReply(vocab("confirmations"));
  }

  // Empathy
  if(lower.includes("stress") || lower.includes("ndihebye")){
    return botReply(vocab("empathy"));
  }

  // Cart commands
  if(lower.startsWith("fata ")){
    const id = lower.split(" ")[1];
    return addToCart(id);
  }
  if(lower.includes("checkout")){
    return showCart();
  }

  // Flexible search: "ndashaka [keyword]" or "shaka [keyword]"
  if(lower.startsWith("ndashaka ") || lower.startsWith("shaka ")){
    const keyword = msg.split(" ").slice(1).join(" ").toLowerCase();
    const results = JB_PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(keyword) ||
      p.category.toLowerCase().includes(keyword) ||
      p.desc.toLowerCase().includes(keyword)
    );
    return renderResults(results, keyword);
  }

  // Price filters
  if(lower.includes("munsi ya")){
    const n = parseInt(lower.replace(/\D+/g,''), 10);
    const results = JB_PRODUCTS.filter(p => p.price < n);
    return renderResults(results, `munsi ya ${n}`);
  }
  if(lower.includes("hejuru ya")){
    const n = parseInt(lower.replace(/\D+/g,''), 10);
    const results = JB_PRODUCTS.filter(p => p.price > n);
    return renderResults(results, `hejuru ya ${n}`);
  }

  // 📂 Direct category search (e.g. "imbuto", "snacks", "isuku")
  const catResults = JB_PRODUCTS.filter(p => p.category.toLowerCase() === lower);
  if(catResults.length){
    return renderResults(catResults, lower);
  }

  // Default fallback
  if(!userName){
    return askNameIfNeeded();
  }
  return botReply("Ndakumva sha 🌸, ushobora kumbwira ibyo ushaka: ndashaka [izina], imbuto, snacks, munsi ya 2000, hejuru ya 3000, checkout…");
}function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  renderMessage('user', text);
  chatInput.value = '';
  handleMessage(text);
}

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') sendMessage();
});

// On load, greet
if(!userName){
  askNameIfNeeded();
} else {
  botReply(`Bite ${userName} 🌸, urakaza neza kuri Jeune Boutique!`);
}
