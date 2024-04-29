var express = require("express");
var router = express.Router();
var { ObjectId } = require("mongodb");

/* Hämtar ALLA användare */
router.get("/", function (req, res) {
  req.app.locals.db
    .collection("users")
    .find({}, { projection: { password: 0 } })
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

// Hämta specifik användare
router.post("/", async (req, res) => {
  const id = req.body._id;
  if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({ message: "Ogiltigt användarID" });
  }
  try {
    const user = await req.app.locals.db
      .collection("users")
      .findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });
    if (!user) {
      return res.status(404).json({ message: "Användaren hittades inte" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internt serverfel" });
  }
});

/*Lägga till användare*/
router.post("/add", function (req, res) {
  req.app.locals.db
    .collection("users")
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

//Logga in
router.post("/login", async function (req, res) {
  const { email, password } = req.body;

  try {
    const user = await req.app.locals.db
      .collection("users")
      .findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: "Ogiltiga inloggningsuppgifter" });
    }

    if (password !== user.password) {
      return res.status(401).json({ message: "Ogiltiga inloggningsuppgifter" });
    }

    res.status(200).json({ message: "Inloggning lyckades" });
  } catch (error) {
    console.error("Fel vid inloggning:", error);
    res.status(500).json({ message: "Internt serverfel" });
  }
});

module.exports = router;
