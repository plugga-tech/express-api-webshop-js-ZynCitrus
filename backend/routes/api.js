var express = require('express');
var router = express.Router();
var { ObjectId } = require('mongodb');

/* Hämtar ALLA användare */
router.get('/users', function(req, res, next) {
  req.app.locals.db.collection("users").find().toArray()
  .then(results => {
      console.log(results)
      })
});

/*Hämtar specifik användare*/

router.post('/users', async function(req, res, next) {
  try {
    let id = req.body.id;
    console.log("id", id);
    let result = await req.app.locals.db.collection("users").findOne({"_id": new ObjectId(id)});
    console.log(result);
    res.json(result);
  } catch (error) {
    console.error(error);
  }
});

/*Lägger till användare*/
router.post("/users/add", function(req, res) { 
  req.app.locals.db.collection("users").insertOne(req.body)
  .then(result => {
    console.log(result)
  });
});

/* Logga in användare */
router.post("/users/login", function(req, res) {
  const { email, password } = req.body;

  req.app.locals.db.collection("users").findOne({ email })
    .then(user => {
      if (!user) {
        res.status(400).send({ message: 'Ogiltig epost' });
        return;
      }

      if (user.password !== password) {
        res.status(400).send({ message: 'Ogiltigt lösenord' });
        return;
      }

      // Password is correct
      res.status(200).send({ message: 'Rätt!' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send({ message: 'Servern gick åt helvete på nåt sätt' });
    });
});

/* Hämtar ALLA produkter */
router.get('/products', function(req, res, next) {
  req.app.locals.db.collection("products").find().toArray()
  .then(results => {
      console.log(results)
      })
});


/* Hämta specifik produkt*/
router.get("/api/products/:id", function(req, res) {
  const productId = req.params.id;

  req.app.locals.db.collection("products").findOne({ _id: ObjectId(productId) })
    .then(product => {
      if (!product) {
        res.status(404).send({ message: 'Product not found' });
        return;
      }

      res.status(200).send(product);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send({ message: 'Internal server error' });
    });
});


/*Lägga till produkt*/
router.post("/products/add", function(req, res) {
  req.app.locals.db.collection("products").insertOne(req.body)
  .then(result => {
    console.log(result)
  });
});


/* Skapa order*/

router.post("/orders/add", function(req, res) {
  req.app.locals.db.collection("orders").insertOne(req.body)
  .then(result => {
    console.log(result)
  });
});

/* Hämtar ALLA orders */
router.get('/orders/all', function(req, res, next) {
  req.app.locals.db.collection("orders").find().toArray()
  .then(results => {
      console.log(results)
      })
});
module.exports = router;