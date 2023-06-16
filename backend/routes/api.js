var express = require('express');
var router = express.Router();
var { ObjectId } = require('mongodb');

/* Hämtar ALLA användare */
router.get('/users', function(req, res, next) {
  req.app.locals.db.collection("users").find().toArray()
  .then(results => {
      console.log(results);
      res.json(results);
  })
  .catch(error => {
      console.error(error);
      res.status(500).send({ message: 'Internal server error' });
  });
});

/*Lägger till användare*/
router.post("/users/add", function(req, res) { 
  req.app.locals.db.collection("users").insertOne(req.body)
  .then(result => {
    console.log(result);
    res.sendStatus(200); 
  })
  .catch(error => {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  });
});

/* Hämtar ALLA produkter */
router.get('/products', function(req, res, next) {
  req.app.locals.db.collection("products").find().toArray()
  .then(results => {
      console.log(results);
      res.json(results); 
  })
  .catch(error => {
      console.error(error);
      res.status(500).send({ message: 'Internal server error' });
  });
});

/* Lägga till produkt */
router.post("/api/products/add", function(req, res) {
  const product = req.body;

  req.app.locals.db.collection("products").insertOne(product)
    .then(result => {
      console.log(result);
      res.sendStatus(200);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send({ message: 'Internal server error' });
    });
});


/* Hämtar ALLA orders */
router.get('/orders/all', function(req, res, next) {
  req.app.locals.db.collection("orders").find().toArray()
  .then(results => {
      console.log(results);
      res.json(results); 
  })
  .catch(error => {
      console.error(error);
      res.status(500).send({ message: 'Internal server error' });
  });
});

/* Skapa order*/
router.post("/api/orders/add", async function(req, res) {
  const order = req.body;

  try {
    const user = await req.app.locals.db.collection("users").findOne({ _id: ObjectId(order.user) });

    if (!user) {
      res.status(404).send({ message: 'User not found' });
      return;
    }

    const products = order.products;

    for (const product of products) {
      const productId = product.productId;
      const quantity = product.quantity;

      const productToUpdate = await req.app.locals.db.collection("products").findOne({ _id: ObjectId(productId) });

      if (!productToUpdate) {
        res.status(404).send({ message: 'Product not found' });
        return;
      }

      if (productToUpdate.lager < quantity) {
        res.status(400).send({ message: 'Insufficient stock for the product' });
        return;
      }

      productToUpdate.lager -= quantity;

      await req.app.locals.db.collection("products").updateOne(
        { _id: ObjectId(productId) },
        { $set: { lager: productToUpdate.lager } }
      );

      console.log(`Updated stock for product ${productId}: ${productToUpdate.lager}`);
    }

    const orderResult = await req.app.locals.db.collection("orders").insertOne(order);
    console.log(orderResult);

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
});
