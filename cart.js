/***********************
 * KOSÁR ADATTÁROLÓ
 ***********************/
let cart = [];


/***********************
 * TERMÉK ADATBÁZIS
 ***********************/
const products = {
  iphone17pro: {
    id: "iphone17pro",
    name: "Apple iPhone 17 Pro Max",
    price: 1499,
    images: [
      "https://www.telekom.hu/shop/static-tkws-media/sku/IPHONE_17_PRO_MAX_256GB_BLU/ProductPictures/ProductPictures01/IPHONE_17_PRO_MAX_256GB_BLU_01_800.png"
    ],
    specs: {
      RAM: "12 GB",
      CPU: "A19 Pro",
      Camera: "48 MP Triple",
      Display: "6.9 OLED"
    },
    description: "The most powerful iPhone ever created."
  },

  s25: {
    id: "s25",
    name: "Samsung Galaxy S25",
    price: 1299,
    images: [
      "https://www.telekom.hu/shop/static-tkws-media/sku/SAM_GAL_S25_5G_DS_128GB_BLU/ProductPictures/ProductPictures01/SAM_GAL_S25_5G_DS_128GB_BLU_01_800.png"
    ],
    specs: {
      RAM: "12 GB",
      CPU: "Snapdragon 8 Gen 4",
      Camera: "200 MP",
      Display: "6.8 AMOLED"
    },
    description: "Ultra performance flagship device."
  }
};


function formatPrice(price) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
}

console.log(formatPrice(products.iphone17pro.price));
const specIcons = {
  RAM: "fa-memory",
  CPU: "fa-microchip",
  Camera: "fa-camera",
  Display: "fa-mobile-screen"
};
/***********************
 * TERMÉK MODAL MEGNYITÁS
 ***********************/
function openProduct(id) {
  const product = products[id];
  if (!product) return;

  document.getElementById("product-title").textContent = product.name;
  document.getElementById("product-description").textContent = product.description;
  document.getElementById("product-price").textContent = "€" + product.price;
  document.getElementById("product-main-image").src = product.images[0];

  const specsDiv = document.getElementById("product-specs");
  specsDiv.innerHTML = "";

for (let key in product.specs) {
  const icon = specIcons[key] || "fa-circle-info";

  specsDiv.innerHTML += `
    <div class="spec-item">
      <i class="fa-solid ${icon}"></i>
      <div class="spec-text">
        <span class="spec-key">${key}</span>
        <span class="spec-value">${product.specs[key]}</span>
      </div>
    </div>
  `;
}
  document.getElementById("add-to-cart-btn").onclick = function () {
    addToCart(product.id);
  };

  document.getElementById("product-modal").classList.add("show");
}


/***********************
 * MODAL BEZÁRÁS
 ***********************/
function closeProduct() {
  document.getElementById("product-modal").classList.remove("show");
}


/***********************
 * KOSÁRBA RAKÁS
 ***********************/
function addToCart(id) {
  const product = products[id];
  if (!product) return;

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }

  renderCart();
}


/***********************
 * KOSÁR RENDERELÉS
 ***********************/
function renderCart() {
  const cartItemsDiv = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");

  cartItemsDiv.innerHTML = "";

  let totalItems = 0;
  let totalPrice = 0;

  cart.forEach((item, index) => {
    totalItems += item.quantity;
    totalPrice += item.price * item.quantity;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <span>${item.name} x ${item.quantity}</span>
      <span>€${item.price * item.quantity}</span>
      <button onclick="removeFromCart(${index})">?</button>
    `;

    cartItemsDiv.appendChild(div);
  });

  cartCount.textContent = totalItems;

  if (cart.length > 0) {
    const totalDiv = document.createElement("div");
    totalDiv.style.marginTop = "15px";
    totalDiv.style.fontWeight = "bold";
    totalDiv.innerHTML = `Total: €${totalPrice}`;
    cartItemsDiv.appendChild(totalDiv);
  }
}


/***********************
 * TÖRLÉS KOSÁRBÓL
 ***********************/
function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}


/***********************
 * KOSÁR PANEL TOGGLE
 ***********************/
function toggleCart() {
  document.getElementById("cart-panel").classList.toggle("show");
}


/***********************
 * FIZETÉS (STRIPE BACKEND)
 ***********************/
document.getElementById("checkout").addEventListener("click", async () => {
  if (cart.length === 0) {
    alert("Your gasket is empty");
    return;
  }

  try {
    const res = await fetch("/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart })
    });

    const data = await res.json();
    window.location = data.url;
  } catch (error) {
    console.error("Hiba a fizetésnél:", error);
    alert("Hiba történt a fizetés elindításakor.");
  }
});



