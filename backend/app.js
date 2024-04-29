var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var productsRouter = require("./routes/products");
var ordersRouter = require("./routes/orders");
var app = express();

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";

const PORT = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

MongoClient.connect(url)
  .then((client) => {
    console.log("Connected to the database");

    const db = client.db("sebastian-nilsson");
    app.locals.db = db;
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/orders", ordersRouter);

module.exports = app;
