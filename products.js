// js/products.js
window.JB_PRODUCTS = [
  { id: 1, name: "Amata ya Mukamu", category: "amata", price: 1800, stock: 24, desc: "Amata meza, fresh ku muhingo.", image: "assets/amata1.jpg" },
  { id: 2, name: "Amata y'ifu", category: "amata", price: 3200, stock: 12, desc: "Yoroheje kubika, yoroshwa amazi.", image: "assets/amata2.jpg" },
  { id: 3, name: "Jus d'ananas", category: "Ibinyobwa", price: 1500, stock: 40, desc: "Jus y'ananasi ishaririza neza.", image: "assets/jus1.jpg" },
  { id: 4, name: "Soda Cola 50cl", category: "Ibinyobwa", price: 1200, stock: 60, desc: "Soda ishushe ku bukonje.", image: "assets/soda1.jpg" },
  { id: 5, name: "Savon Isuku", category: "isuku", price: 900, stock: 70, desc: "Isabune y'indimu, ihumura neza.", image: "assets/savon1.jpg" },
  { id: 6, name: "Serviettes Soft", category: "isuku", price: 2100, stock: 25, desc: "Papier doux, umwumbati.", image: "assets/serviettes.jpg" }
];

// Scale to 100+ by appending; keep images lazy and debounce search in chatbot.

// Predefined bundles
window.JB_BUNDLES = {
  "Isuku Starter": { ids: [5, 6], bundlePrice: 2800 },
  "Ibinyobwa Mini": { ids: [3, 4], bundlePrice: 2400 }
};

// Light tips/jokes set for daily spinner
window.JB_JOKES_RW = [
  "Umudandaza w’amatunda yasavye kugabanyirizwa, bamubwira ngo: ureke kugura urye akaryoshye! 😊",
  "Ugiye gusuma ku isoko: ntujane inzara nyinshi, izagutwara budget! 🌸",
  "Amata meza araryoha, ariko n’urukundo rw’umukiriya ruryoshya kurusha! 💙",
  "Iyo ufise igare ryuzuye, umutima wuzura akanyamuneza 🎉"
];
