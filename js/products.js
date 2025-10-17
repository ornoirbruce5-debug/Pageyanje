// js/products.js

// Utility: format price with currency
window.formatPrice = function(price) {
  return price.toLocaleString("fr-FR") + " Fbu";
};

window.JB_PRODUCTS = [
  {
    id: 1,
    sku: "JB-AMATA-001",
    name: "Amata ya Mukamu",
    category: "amata",
    price: 1800,
    stock: 24,
    status: "in-stock",
    desc: "Amata meza, fresh ku muhingo.",
    image: "assets/amata1.jpg",
    tags: ["fresh", "local", "bio"]
  },
  {
    id: 2,
    sku: "JB-AMATA-002",
    name: "Amata y'ifu",
    category: "amata",
    price: 3200,
    stock: 12,
    status: "low-stock",
    desc: "Yoroheje kubika, yoroshwa amazi.",
    image: "assets/amata2.jpg",
    tags: ["powder", "long-life"]
  },
  {
    id: 3,
    sku: "JB-DRINK-001",
    name: "Jus d'ananas",
    category: "ibinyobwa",
    price: 1500,
    stock: 40,
    status: "in-stock",
    desc: "Jus y'ananasi ishaririza neza.",
    image: "assets/jus1.jpg",
    tags: ["drink", "fruit", "refreshing"],
    discount: 0.15
  },
  {
    id: 4,
    sku: "JB-DRINK-002",
    name: "Soda Cola 50cl",
    category: "ibinyobwa",
    price: 1200,
    stock: 60,
    status: "in-stock",
    desc: "Soda ishushe ku bukonje.",
    image: "assets/soda1.jpg",
    tags: ["soda", "soft-drink"]
  },
  {
    id: 5,
    sku: "JB-ISUKU-001",
    name: "Savon Isuku",
    category: "isuku",
    price: 900,
    stock: 70,
    status: "in-stock",
    desc: "Isabune y'indimu, ihumura neza.",
    image: "assets/savon1.jpg",
    tags: ["soap", "lemon", "hygiene"]
  },
  {
    id: 6,
    sku: "JB-ISUKU-002",
    name: "Serviettes Soft",
    category: "isuku",
    price: 2100,
    stock: 25,
    status: "in-stock",
    desc: "Papier doux, umwumbati.",
    image: "assets/serviettes.jpg",
    tags: ["toilet-paper", "soft"]
  },
  {
    id: 7,
    sku: "JB-FOOD-001",
    name: "Pain Complet",
    category: "ibifungurwa",
    price: 1300,
    stock: 30,
    status: "in-stock",
    desc: "Umutsima wuzuye, wuzuye fibre.",
    image: "assets/pain.jpg",
    tags: ["bread", "wholegrain"]
  },
  {
    id: 8,
    sku: "JB-FOOD-002",
    name: "Riz Basmati 1kg",
    category: "ibifungurwa",
    price: 2900,
    stock: 50,
    status: "in-stock",
    desc: "Riz yoroheje, iryoshye ku mafunguro.",
    image: "assets/riz.jpg",
    tags: ["rice", "basmati"]
  },
  {
    id: 9,
    sku: "JB-FOOD-003",
    name: "Huile de Tournesol",
    category: "ibifungurwa",
    price: 4800,
    stock: 20,
    status: "low-stock",
    desc: "Amavuta meza yo guteka.",
    image: "assets/huile.jpg",
    tags: ["oil", "sunflower"]
  },
  {
    id: 10,
    sku: "JB-IMBOGA-001",
    name: "Tomates fraîches 1kg",
    category: "imboga",
    price: 1500,
    stock: 35,
    status: "in-stock",
    desc: "Tomates zifasha guteka sauce.",
    image: "assets/tomates.jpg",
    tags: ["vegetable", "tomato"]
  },
  {
    id: 11,
    sku: "JB-IMBOGA-002",
    name: "Carottes fraîches 1kg",
    category: "imboga",
    price: 1400,
    stock: 40,
    status: "in-stock",
    desc: "Carottes zifasha salade n’isupu.",
    image: "assets/carottes.jpg",
    tags: ["vegetable", "carrot"]
  },
  {
    id: 12,
    sku: "JB-IMBOGA-003",
    name: "Oignons rouges 1kg",
    category: "imboga",
    price: 1600,
    stock: 45,
    status: "in-stock",
    desc: "Ibitunguru bitukura, biryoshye.",
    image: "assets/oignons.jpg",
    tags: ["vegetable", "onion"]
  },
  {
    id: 13,
    sku: "JB-SNACK-001",
    name: "Biscuit Chocolat",
    category: "snacks",
    price: 800,
    stock: 100,
    status: "in-stock",
    desc: "Biscuit y'ifu y'isukari n'ibishishwa bya chocolat.",
    image: "assets/biscuit.jpg",
    tags: ["snack", "biscuit", "chocolate"]
  },
  {
    id: 14,
    sku: "JB-SNACK-002",
    name: "Chips Nature",
    category: "snacks",
    price: 700,
    stock: 80,
    status: "in-stock",
    desc: "Chips zifite umunyu muke, ziryoshye ku rugendo.",
    image: "assets/chips.jpg",
    tags: ["snack", "chips"]
  },
  {
    id: 15,
    sku: "JB-DRINK-003",
    name: "Eau Minérale 1L",
    category: "ibinyobwa",
    price: 1000,
    stock: 90,
    status: "in-stock",
    desc: "Amazi meza, atagira gaz, 1L.",
    image: "assets/eau.jpg",
    tags: ["water", "drink"]
  },
  {
    id: 16,
    sku: "JB-ISUKU-003",
    name: "Lait Corporel",
    category: "isuku",
    price: 3500,
    stock: 18,
    status: "low-stock",
    desc: "Amavuta yo kwisiga, yoroheje uruhu.",
    image: "assets/lait.jpg",
    tags: ["cosmetic", "body-lotion"]
  },
  {
    id: 17,
    sku: "JB-ISUKU-004",
    name: "Crème Visage",
    category: "isuku",
    price: 4200,
    stock: 15,
    status: "low-stock",
    desc: "Crème y’amaso, irinda izuba.",
    image: "assets/creme.jpg",
    tags: ["cosmetic", "face-cream"]
  },
  {
    id: 18,
    sku: "JB-IMBUTO-001",
    name: "Banane douce 1kg",
    category: "imbuto",
    price: 1300,
    stock: 50,
    status: "in-stock",
    desc: "Imineke yoroshye, iryoshye ku bana.",
    image: "assets/banane.jpg",
    tags: ["fruit", "banana"]
  },
  {
    id: 19,
    sku: "JB-IMBUTO-002",
    name: "Avocat frais 1kg",
    category: "imbuto",
    price: 2000,
    stock: 40,
    status: "in-stock",
    desc: "Avocat zifasha salade n’amavuta y’umwimerere.",
    image: "assets/avocat.jpg",
    tags: ["fruit", "avocado"]
  },
  {
   {
    id: 20,
    sku: "JB-IMBUTO-003",
    name: "Mangue mûre 1kg",
    category: "imbuto",
    price: 1700,
    stock: 45,
    status: "in-stock",
    desc: "Mangue ziryoshye, zifasha jus na dessert.",
    image: "assets/mangue.jpg",
    tags: ["fruit", "mango"]
  }
];
