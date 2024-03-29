require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.post("/checkout", async (req, res) => {
  const items = req.body.items;
  let lineItems = [];
  items.forEach((item) => {
    lineItems.push({
      price: item.stripePriceId,
      quantity: item.quantity,
    });
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: process.env.CLIENT_URL,
    cancel_url: process.env.CLIENT_URL,
  });

  res.json({
    url: session.url,
  });
});

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
