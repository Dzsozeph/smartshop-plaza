const express = require("express");
const app = express();

const Stripe = require("stripe");
const stripe = Stripe("sk_test_51T3fQaHS1P3YeqJEXQTmkkvVWTaIToe2q2eDPYOUEUaW16X5UsWYloNLSeoZYnW6fdNgdpD5AGb9LU4wXoRcpWDg00tZaqTERv"); // → ide a saját Stripe secret key

app.use(express.json());
app.use(express.static("public")); // index.html, style.css, cart.js legyen a "public" mappában

// Stripe checkout endpoint
app.post("/create-checkout-session", async (req, res) => {
  const { items } = req.body;

  const PRODUCTS = {
    hoodie: { name: "Fekete Hoodie", price: 4500 }, // ár centben
    cap: { name: "Minimal Sapka", price: 2500 }
  };

  const lineItems = items.map(item => {
    const product = PRODUCTS[item.id];
    return {
      price_data: {
        currency: "eur",
        product_data: { name: product.name },
        unit_amount: product.price
      },
      quantity: item.quantity
    };
  });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:3000/success.html",
      cancel_url: "http://localhost:3000/cancel.html"
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Hiba történt a fizetés létrehozásakor" });
  }
});

app.listen(3000, () => {
  console.log("Szerver fut: http://localhost:3000");
});