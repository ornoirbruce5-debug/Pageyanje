// products.js — Jeune Boutique catalogue (default 10 products)

window.JB_PRODUCTS = [
  {
    id: 1,
    name: "Yaourt Nature",
    category: "amata",
    price: 1500,
    stock: 20,
    desc: "Yaourt isukuye, ikonje neza",
    image: "assets/yaourt.jpg"
  },
  {
    id: 2,
    name: "Fanta Orange",
    category: "ibinyobwa",
    price: 1000,
    stock: 50,
    desc: "Inyota irashira",
    image: "assets/fanta.jpg"
  },
  {
    id: 3,
    name: "Ibirato Boys",
    category: "ibirato vyabahungu",
    price: 12000,
    stock: 10,
    desc: "Ibirato bikomeye vy’abahungu",
    image: "assets/shoes_boys.jpg"
  },
  {
    id: 4,
    name: "Ibirato Girls",
    category: "ibirato vy'abakobwa",
    price: 15000,
    stock: 8,
    desc: "Ibirato byiza vy’abakobwa",
    image: "assets/shoes_girls.jpg"
  },
  {
    id: 5,
    name: "Amahereni Gold",
    category: "impuzu",
    price: 5000,
    stock: 15,
    desc: "Amahereni y’imitako ya zahabu",
    image: "assets/earrings.jpg"
  },
  {
    id: 6,
    name: "T-shirt Jeune",
    category: "impuzu",
    price: 7000,
    stock: 25,
    desc: "T-shirt y’urubyiruko",
    image: "assets/tshirt.jpg"
  },
  {
    id: 7,
    name: "Cap Youth",
    category: "impuzu",
    price: 4000,
    stock: 30,
    desc: "Cap y’urubyiruko",
    image: "assets/cap.jpg"
  },
  {
    id: 8,
    name: "Juice Cocktail",
    category: "ibinyobwa",
    price: 2000,
    stock: 40,
    desc: "Juice mix ikonje",
    image: "assets/juice.jpg"
  },
  {
    id: 9,
    name: "Sneakers Trendy",
    category: "ibirato vy'abakobwa",
    price: 18000,
    stock: 12,
    desc: "Sneakers zigezweho",
    image: "assets/sneakers.jpg"
  },
  {
    id: 10,
    name: "Milk Fresh",
    category: "amata",
    price: 1200,
    stock: 60,
    desc: "Amata mashya",
    image: "assets/milk.jpg"
  }
];

// Override with localStorage if admin updated
(function(){
  const persisted = localStorage.getItem('jb_products_admin');
  if (persisted) {
    try {
      window.JB_PRODUCTS = JSON.parse(persisted);
    } catch(e) {
      console.warn("Failed to parse persisted products:", e);
    }
  }
})();
