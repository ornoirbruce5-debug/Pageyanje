// js/ui.js
(function(){
  // Dark mode toggle
  const body = document.body;
  const toggle = document.getElementById('darkToggle');
  toggle.addEventListener('click', () => {
    const next = body.classList.contains('dark') ? 'light' : 'dark';
    body.classList.remove('light','dark');
    body.classList.add(next);
    localStorage.setItem('jb_theme', next);
  });
  const storedTheme = localStorage.getItem('jb_theme');
  if (storedTheme){ body.classList.remove('light','dark'); body.classList.add(storedTheme); }

  // Video fallback
  const video = document.getElementById('heroVideo');
  const fallback = document.getElementById('heroFallback');
  video.addEventListener('error', () => { fallback.style.opacity = 1; });
  video.addEventListener('loadeddata', () => { fallback.style.opacity = 0; });

  // Render products
  const grid = document.getElementById('productsGrid');
  function renderProducts(list){
    const frag = document.createDocumentFragment();
    list.forEach(p => {
      const card = document.createElement('article');
      card.className = 'product card';
      card.dataset.id = String(p.id);

      const img = document.createElement('img');
      img.src = p.image;
      img.alt = p.name;
      img.loading = 'lazy';

      const name = document.createElement('h3');
      name.textContent = p.name;

      const desc = document.createElement('p');
      desc.textContent = p.desc;

      const meta = document.createElement('div');
      meta.className = 'meta';
      const price = document.createElement('span');
      price.className = 'price';
      price.textContent = `${p.price} Fbu`;
      const stock = document.createElement('small');
      stock.textContent = `Stock: ${p.stock}`;
      meta.append(price, stock);

      card.append(img, name, desc, meta);
      frag.appendChild(card);
    });
    grid.innerHTML = '';
    grid.appendChild(frag);
  }
  renderProducts(window.JB_PRODUCTS);

  // Daily joke spinner button
  const btnJoke = document.getElementById('spinJoke');
  const jokeEl = document.getElementById('dailyJoke');
  function setDailyJoke(){
    const joke = window.JB_CHATBOT ? window.JB_CHATBOT.dailyJoke?.() : null; // if exposed
    const key = (function(){
      const d = new Date();
      return `jb_daily_joke_${d.getFullYear()}_${String(d.getMonth()+1).padStart(2,'0')}_${String(d.getDate()).padStart(2,'0')}`;
    })();
    const existing = localStorage.getItem(key);
    const final = existing || window.JB_JOKES_RW[Math.floor(Math.random()*window.JB_JOKES_RW.length)];
    localStorage.setItem(key, final);
    jokeEl.textContent = final;
  }
  btnJoke.addEventListener('click', setDailyJoke);
  setDailyJoke();

  // Chat controls
  const input = document.getElementById('chatInput');
  const send = document.getElementById('sendBtn');

  // Debounce helper
  function debounce(fn, wait){
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
  }

  function sendMessage(){
    const text = input.value.trim();
    if (!text) return;
    // Security: avoid HTML
    window.JB_CHATBOT.handleCommand(text);
    // Echo user in UI
    (function echoUser(){
      const wnd = document.getElementById('chatWindow');
      const div = document.createElement('div');
      div.className = 'msg';
      const b = document.createElement('div');
      b.className = 'bubble user';
      b.textContent = text;
      div.appendChild(b);
      wnd.appendChild(div);
      wnd.scrollTop = wnd.scrollHeight;
    })();
    input.value = '';
  }

  send.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  // Initialize chatbot
  window.addEventListener('DOMContentLoaded', () => {
    if (window.JB_CHATBOT && window.JB_CHATBOT.init) window.JB_CHATBOT.init();
  });

  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Placeholder for Puter.js integration (optional)
  // Example: use Puter.js for lightweight backend/storage if needed later.
  // Ensure any external script loads after DOM and is sandboxed.
})();
