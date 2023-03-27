var express = require('express');
var router = express.Router();
const { ObjectId } = require("mongodb");

/* Hämtar ALLA användare */
router.get('/users', function(req, res, next) {
  req.app.locals.db.collection("users").find().toArray()
  .then(results => {
      console.log(results)
      })
});

/* Hämtar specifik användare, ej klar, får bara Null
router.post('/users', function(req, res, next) {
  id = req.params.id;
  console.log(id);
  req.app.locals.db.collection("users").findOne({"id": new ObjectId(id)})
  .then(result => {
    console.log(result);

     res.json(result)
  })
});
*/

/*Lägger till användare*/
router.post("/users/add", function(req, res) {
  req.app.locals.db.collection("users").insertOne(req.body)
  .then(result => {
    console.log(result)
  });
});

/* Logga in användare */

/* Hämtar ALLA produkter */
router.get('/products', function(req, res, next) {
  req.app.locals.db.collection("products").find().toArray()
  .then(results => {
      console.log(results)
      })
});


/* Hämta specifik produkt*/


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