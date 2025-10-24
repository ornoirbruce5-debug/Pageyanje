// cart.js — Jeune Boutique

const CART_KEY = 'jb_cart';

// Elements
const itemsEl = document.getElementById('cartItems');
const subtotalEl = document.getElementById('subtotal');
const deliveryEl = document.getElementById('delivery');
const totalEl = document.getElementById('total');
const zoneSel = document.getElementById('deliveryZone');
const checkoutBtn = document.getElementById('checkoutBtn');
const badgeEl = document.getElementById('cartBadge');
const tpl = document.getElementById('cartItemTpl');
const clearBtn = document.getElementById('clearCart');

// State
let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');

// Helpers
function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function formatFbu(n) {
  return `${(n || 0).toLocaleString('en-US')} Fbu`;
}
function lineTotal(p) {
  return (p.price || 0) * (p.qty || 1);
}

// Render gare
function render() {
  itemsEl.innerHTML = '';

  if (!cart.length) {
    // Empty state with icon + message + back link
    itemsEl.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🛍️</div>
        <p>Gare yawe iracyari ubusa 😌</p>
        <a href="stock.html" class="btn primary">⬅️ Subira kuri Catalogue</a>
      </div>
    `;
    // Totals and checkout
    subtotalEl.textContent = formatFbu(0);
    const deliveryCost = parseInt(zoneSel?.value || '0', 10) || 0;
    deliveryEl.textContent = formatFbu(deliveryCost);
    totalEl.textContent = formatFbu(deliveryCost);
    updateBadge();
    updateCheckoutLink();
    return;
  }

  cart.forEach((p, idx) => {
    const node = tpl.content.cloneNode(true);

    node.querySelector('.item-img').src = p.image;
    node.querySelector('.item-img').alt = p.name;
    node.querySelector('.item-title').textContent = p.name;
    node.querySelector('.item-price').textContent = formatFbu(p.price);
    node.querySelector('.qty.input').value = p.qty;
    node.querySelector('.line-total').textContent = formatFbu(lineTotal(p));

    // Qty controls
    node.querySelector('.qty.minus').addEventListener('click', () => {
      cart[idx].qty = Math.max(1, (cart[idx].qty || 1) - 1);
      saveCart(); render();
    });
    node.querySelector('.qty.plus').addEventListener('click', () => {
      cart[idx].qty = (cart[idx].qty || 1) + 1;
      saveCart(); render();
    });
    node.querySelector('.qty.input').addEventListener('input', e => {
      let q = parseInt(e.target.value, 10);
      if (isNaN(q) || q < 1) q = 1;
      cart[idx].qty = q;
      saveCart(); render();
    });

    // Remove
    node.querySelector('.btn.remove').addEventListener('click', () => {
      cart.splice(idx, 1);
      saveCart(); render();
    });

    itemsEl.appendChild(node);
  });

  updateTotals();
  updateBadge();
  updateCheckoutLink();
}

// Totals
function updateTotals() {
  const subtotal = cart.reduce((sum, p) => sum + lineTotal(p), 0);
  const delivery = parseInt(zoneSel?.value || '0', 10) || 0;
  const total = subtotal + delivery;

  subtotalEl.textContent = formatFbu(subtotal);
  deliveryEl.textContent = formatFbu(delivery);
  totalEl.textContent = formatFbu(total);
}

// Badge
function updateBadge() {
  const count = cart.reduce((sum, i) => sum + (i.qty || 1), 0);
  if (badgeEl) badgeEl.textContent = count;
}

// WhatsApp checkout link
function updateCheckoutLink() {
  if (!checkoutBtn) return;

  const subtotal = cart.reduce((sum, p) => sum + lineTotal(p), 0);
  const delivery = parseInt(zoneSel?.value || '0', 10) || 0;
  const total = subtotal + delivery;

  let msg;
  if (!cart.length) {
    msg = `Muraho! Gare iri ubusa. Ndasubiye kuri catalogue.`;
  } else {
    const lines = cart.map(p => `${p.name} x${p.qty} = ${formatFbu(lineTotal(p))}`);
    msg = [
      `Muraho neza! 😃`,
      `Ibyo naguze kuri Jeune Boutique:`,
      ...lines.map(l => `- ${l}`),
      `Subtotal: ${formatFbu(subtotal)}`,
      `Delivery: ${formatFbu(delivery)}`,
      `Total: ${formatFbu(total)}`
    ].join('\n');
  }

  checkoutBtn.href = `https://wa.me/25771633859?text=${encodeURIComponent(msg)}`;
}

// Clear cart
if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    if (!cart.length) return;
    if (confirm('Urashaka gusukura gare yose?')) {
      cart = [];
      localStorage.removeItem(CART_KEY);
      render();
      alert("Gare yasibwe neza 🧹");
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

// Init
render();
