var express = require("express");
var router = express.Router();
var { ObjectId } = require("mongodb");

/* Hämtar ALLA produkter */
router.get("/", function (req, res, next) {
  req.app.locals.db
    .collection("products")
    .find()
    .toArray()
    .then((results) => {
      console.log(results);
      res.json(results);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    });
});

/* Lägga till produkt */
router.post("/add", function (req, res) {
  const productData = req.body;

  if (
    !productData.name ||
    !productData.description ||
    !productData.price ||
    !productData.lager
  ) {
    return res
      .status(400)
      .json({ message: "Alla nödvändiga fält måste vara ifyllda" });
  }

  req.app.locals.db
    .collection("products")
    .insertOne(productData)
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Produkt skapad framgångsrikt",
        productId: result.insertedId,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Internt serverfel" });
    });
});

/* Hämta specifik vara */
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  console.log("foo", id);
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({ message: "Ogiltigt produktID" });
  }
  try {
    const product = await req.app.locals.db
      .collection("products")
      .findOne({ _id: new ObjectId(id) });
    if (!product) {
      return res.status(404).json({ message: "Produkten hittades inte" });
    }

    return res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internt serverfel" });
  }
});

module.exports = router;
