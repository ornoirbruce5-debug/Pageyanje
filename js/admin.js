// admin.js — logic yo gucunga products
let products = window.JB_PRODUCTS || [];

const form = document.getElementById('productForm');
const tableBody = document.querySelector('#productsTable tbody');

function saveProducts() {
  localStorage.setItem('jb_products_admin', JSON.stringify(products));
}

function renderTable() {
  tableBody.innerHTML = '';
  products.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td>${p.price} Fbu</td>
      <td>${p.stock}</td>
      <td>
        <button class="action-btn edit-btn">Edit</button>
        <button class="action-btn delete-btn">Delete</button>
      </td>
    `;
    tr.querySelector('.edit-btn').addEventListener('click', () => editProduct(p.id));
    tr.querySelector('.delete-btn').addEventListener('click', () => deleteProduct(p.id));
    tableBody.appendChild(tr);
  });
}

function editProduct(id) {
  const prod = products.find(p => p.id === id);
  if (!prod) return;
  document.getElementById('productId').value = prod.id;
  document.getElementById('productName').value = prod.name;
  document.getElementById('productCategory').value = prod.category;
  document.getElementById('productPrice').value = prod.price;
  document.getElementById('productStock').value = prod.stock;
  document.getElementById('productImage').value = prod.image;
  document.getElementById('productDesc').value = prod.desc;
}

function deleteProduct(id) {
  if (!confirm("Ushaka gusiba iki gicuruzwa?")) return;
  products = products.filter(p => p.id !== id);
  saveProducts();
  renderTable();
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const id = document.getElementById('productId').value;
  const newProd = {
    id: id ? parseInt(id) : Date.now(),
    name: document.getElementById('productName').value,
    category: document.getElementById('productCategory').value,
    price: parseInt(document.getElementById('productPrice').value),
    stock: parseInt(document.getElementById('productStock').value),
    image: document.getElementById('productImage').value,
    desc: document.getElementById('productDesc').value
  };

  if (id) {
    // update
    const idx = products.findIndex(p => p.id === parseInt(id));
    products[idx] = newProd;
  } else {
    // add
    products.push(newProd);
  }

  saveProducts();
  renderTable();
  form.reset();
  document.getElementById('productId').value = '';
});

// Initial render
renderTable();
