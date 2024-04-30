const express = require("express");
const router = express.Router();

const { ObjectId } = require("mongodb");

// Skapa en order och minska lagret för varje produkt
router.post("/add", async (req, res) => {
  try {
    const { user, products } = req.body;

    const db = req.app.locals.db;

    for (const item of products) {
      const { productId, quantity } = item;

      await db
        .collection("products")
        .updateOne(
          { _id: new ObjectId(productId) },
          { $inc: { lager: -quantity } }
        );
    }
    await db.collection("orders").insertOne({ user, products });

    res
      .status(201)
      .json({ message: "Order skapad och lager minskad för produkterna." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Visa alla orders
router.get("/all", async (req, res) => {
  try {
    const orders = await req.app.locals.db
      .collection("orders")
      .find()
      .toArray();
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internt serverfel" });
  }
});

module.exports = router;
