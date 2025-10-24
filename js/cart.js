// cart.js — Jeune Boutique (final)

const CART_KEY = 'jb_cart';

const itemsEl = document.getElementById('cartItems');
const clearBtn = document.getElementById('clearCart');
const subtotalEl = document.getElementById('subtotal');
const deliveryEl = document.getElementById('delivery');
const totalEl = document.getElementById('total');
const zoneSel = document.getElementById('deliveryZone');
const checkoutBtn = document.getElementById('checkoutBtn');
const badgeEl = document.getElementById('cartBadge');
const tpl = document.getElementById('cartItemTpl');

let cart = readCart();

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch (e) {
    console.warn('Cart parse error:', e);
    return [];
  }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function formatFbu(n) {
  return `${(n || 0).toLocaleString('en-US')} Fbu`;
}

function lineTotal(p) {
  return (p.price || 0) * (p.qty || 1);
}

function render() {
  itemsEl.innerHTML = '';
  if (!cart.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.innerHTML = `
      <p>Gare yawe iracyari ubusa 😌</p>
      <p><a href="stock.html">Tangira guhitamo ibicuruzwa</a></p>
    `;
    itemsEl.appendChild(empty);
    updateTotals();
    updateBadge();
    updateCheckoutLink();
    return;
  }

  const frag = document.createDocumentFragment();

  cart.forEach((p, idx) => {
    const node = tpl.content.cloneNode(true);
    const img = node.querySelector('.item-img');
    const title = node.querySelector('.item-title');
    const price = node.querySelector('.item-price');
    const minus = node.querySelector('.qty.minus');
    const plus = node.querySelector('.qty.plus');
    const input = node.querySelector('.qty.input');
    const removeBtn = node.querySelector('.btn.remove');
    const lineT = node.querySelector('.line-total');

    img.src = p.image || 'assets/placeholder.jpg';
    img.alt = p.name || 'Product';
    title.textContent = p.name || 'Izina ribuze';
    price.textContent = formatFbu(p.price || 0);
    input.value = p.qty || 1;
    lineT.textContent = formatFbu(lineTotal(p));

    minus.addEventListener('click', () => {
      const q = Math.max(1, (parseInt(input.value, 10) || 1) - 1);
      input.value = q;
      cart[idx].qty = q;
      saveCart(); 
      lineT.textContent = formatFbu(lineTotal(cart[idx]));
      updateTotals(); updateBadge(); updateCheckoutLink();
    });

    plus.addEventListener('click', () => {
      const q = (parseInt(input.value, 10) || 1) + 1;
      input.value = q;
      cart[idx].qty = q;
      saveCart(); 
      lineT.textContent = formatFbu(lineTotal(cart[idx]));
      updateTotals(); updateBadge(); updateCheckoutLink();
    });

    input.addEventListener('input', () => {
      let q = parseInt(input.value, 10);
      if (isNaN(q) || q < 1) q = 1;
      input.value = q;
      cart[idx].qty = q;
      saveCart(); 
      lineT.textContent = formatFbu(lineTotal(cart[idx]));
      updateTotals(); updateBadge(); updateCheckoutLink();
    });

    removeBtn.addEventListener('click', () => {
      cart.splice(idx, 1);
      saveCart();
      render(); // re-render list after removal
    });

    frag.appendChild(node);
  });

  itemsEl.appendChild(frag);
  updateTotals();
  updateBadge();
  updateCheckoutLink();
}

function updateTotals() {
  const subtotal = cart.reduce((sum, p) => sum + lineTotal(p), 0);
  const delivery = parseInt(zoneSel?.value || '0', 10) || 0;
  const total = subtotal + delivery;

  subtotalEl.textContent = formatFbu(subtotal);
  deliveryEl.textContent = formatFbu(delivery);
  totalEl.textContent = formatFbu(total);
}

function updateBadge() {
  const count = cart.reduce((sum, i) => sum + (i.qty || 1), 0);
  if (badgeEl) badgeEl.textContent = count;
}

function updateCheckoutLink() {
  // Build a WhatsApp message with cart summary
  if (!checkoutBtn) return;
  if (!cart.length) {
    checkoutBtn.href = 'https://wa.me/25771633859?text=Gare%20y%27ubusa%20%E2%9C%A8';
    return;
  }
  const lines = cart.map(p => `${encodeURIComponent(p.name)}%20x${p.qty}%20(${encodeURIComponent(formatFbu(p.price))})`);
  const subtotal = cart.reduce((sum, p) => sum + lineTotal(p), 0);
  const delivery = parseInt(zoneSel?.value || '0', 10) || 0;
  const total = subtotal + delivery;
  const msg = `Ndaguze:%0A- ${lines.join('%0A- ')}%0ASubtotal: ${encodeURIComponent(formatFbu(subtotal))}%0ADelivery: ${encodeURIComponent(formatFbu(delivery))}%0ATotal: ${encodeURIComponent(formatFbu(total))}`;
  checkoutBtn.href = `https://wa.me/25771633859?text=${msg}`;
}

// Clear cart
if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    if (!cart.length) return;
    if (confirm('Urashaka gusukura gare yose?')) {
      cart = [];
      saveCart();
      render();
    }
  });
}

// Delivery change
if (zoneSel) {
  zoneSel.addEventListener('change', () => {
    updateTotals();
    updateCheckoutLink();
  });
}

// Initial render
render();
