// 🧠 Helper: Load cart from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("jb_cart") || "[]");
}

// 🧠 Helper: Save cart
function saveCart(cart) {
  localStorage.setItem("jb_cart", JSON.stringify(cart));
}

// ➕ Add product to cart
function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }
  saveCart(cart);
  showToast("🛒 Yongewe mu gikapu!");
  floatEmoji("🛍️");
}

// ✅ Show toast
function showToast(msg) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = msg;
  document.getElementById("toast-stack").appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// 🎈 Floating emoji
function floatEmoji(emoji) {
  const span = document.createElement("span");
  span.textContent = emoji;
  span.style.left = Math.random() * window.innerWidth + "px";
  span.style.top = "80%";
  document.getElementById("floating-emojis").appendChild(span);
  setTimeout(() => span.remove(), 2000);
}

// 🛍️ Render cart items
function renderCart() {
  const cart = getCart();
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  const loading = document.getElementById("loading");
  if (!container || !totalEl || !loading) return;

  loading.style.display = "none";
  container.innerHTML = "";

  let total = 0;
  cart.forEach(item => {
    const product = window.products.find(p => p.id === item.id);
    if (!product) return;

    const subtotal = product.price * item.qty;
    total += subtotal;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <strong>${product.name}</strong> x ${item.qty} = ${subtotal} Fbu
      <button onclick="removeFromCart('${item.id}')">❌</button>
    `;
    container.appendChild(div);
  });

  totalEl.textContent = `Total: ${total} Fbu`;
}

// ❌ Remove item
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  renderCart();
  showToast("❌ Cyakuwe mu gikapu");
}

// 📦 Handle checkout
function setupCheckout() {
  const form = document.getElementById("checkout-form");
  const confirmation = document.getElementById("confirmation");
  if (!form || !confirmation) return;

  form.addEventListener("submit", e => {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get("name");
    const phone = data.get("phone");
    const address = data.get("address");

    // Mock sending
    console.log("Commande:", { name, phone, address, cart: getCart() });

    form.style.display = "none";
    confirmation.style.display = "block";
    localStorage.removeItem("jb_cart");
    showToast("🎉 Commande yoherejwe!");
    floatEmoji("💖");
  });
}

// 🚀 Init
window.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("cart-items")) {
    renderCart();
    setupCheckout();
  }
});
