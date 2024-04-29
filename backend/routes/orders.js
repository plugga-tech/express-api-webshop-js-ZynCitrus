const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb"); // För att använda ObjectId

// Skapa en ny order
// Route to handle order creation
router.post("/add", function (req, res) {
  req.app.locals.db
    .collection("orders")
    .insertOne(req.body)
    .then((result) => {
      console.log(result);
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    });
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
