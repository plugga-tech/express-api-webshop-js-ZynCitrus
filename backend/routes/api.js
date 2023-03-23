var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/users', function(req, res, next) {

  req.app.locals.db.collection("users").find().toArray()
  .then(results => {
      console.log(results)
      })
});

router.post("/users/add", function(req, res) {

  req.app.locals.db.collection("users").insertOne(req.body)
  .then(result => {
    console.log(result)
  });
  
});

module.exports = router;
