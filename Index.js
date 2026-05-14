const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const horses = [
  "Morshdi",
  "Talk of New York",
  "Convergent",
  "Tarriance",
  "My Ophelia",
  "Publish"
];

let oldPrices = {};

function fakeLivePrice() {
  return Number((Math.random() * 12 + 2).toFixed(2));
}

function checkBacking(horse, newPrice) {
  const oldPrice = oldPrices[horse];
  oldPrices[horse] = newPrice;

  if (!oldPrice) {
    return {
      horse,
      oldPrice: null,
      newPrice,
      movePercent: 0,
      signal: "NEW"
    };
  }

  const movePercent = ((oldPrice - newPrice) / oldPrice) * 100;

  let signal = "STABLE";

  if (movePercent >= 20) signal = "HEAVILY BACKED 🔥";
  else if (movePercent >= 10) signal = "STEAMING 📈";
  else if (movePercent <= -10) signal = "DRIFTING 📉";

  return {
    horse,
    oldPrice,
    newPrice,
    movePercent: Number(movePercent.toFixed(2)),
    signal
  };
}

app.get("/", (req, res) => {
  res.json({
    message: "Horse backing tracker API running",
    endpoints: ["/prices"]
  });
});

app.get("/prices", (req, res) => {
  const results = horses.map(horse => {
    const price = fakeLivePrice();
    return checkBacking(horse, price);
  });

  res.json(results);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Horse backing API running on port " + PORT);
});
