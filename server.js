const express = require("express");
const cors = require("cors");
const path = require("path");
const stripe = require("stripe")(
  "sk_test_51ObP5JDnlYS1GOoDQqQklWSLProycuXgObRBvkfV49kFM3yQ4xqrP0rnWTukNfSUnZsBMdYx5fBX1tgkjDXyRkbQ00HCLAS2Eo"
);

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "dist")));

app.get(/^\/(?!success|cancel).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.get("/success", (req, res) => {
  res.redirect("https://chic-trend-boutique.onrender.com/success");
});

app.get("/cancel", (req, res) => {
  res.redirect("https://chic-trend-boutique.onrender.com/cancel");
});

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
    success_url: "https://chic-trend-boutique.onrender.com/success",
    cancel_url: "https://chic-trend-boutique.onrender.com/cancel",
  });

  res.json({
    url: session.url,
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
