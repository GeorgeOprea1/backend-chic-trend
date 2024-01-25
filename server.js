const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51ObP5JDnlYS1GOoDQqQklWSLProycuXgObRBvkfV49kFM3yQ4xqrP0rnWTukNfSUnZsBMdYx5fBX1tgkjDXyRkbQ00HCLAS2Eo"
);

const app = express();
app.use(cors());
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
    success_url: "https://chic-trend.netlify.app/success",
    cancel_url: "https://chic-trend.netlify.app/",
  });

  res.json({
    url: session.url,
  });
});

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
