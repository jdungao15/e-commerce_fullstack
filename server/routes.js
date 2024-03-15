const express = require("express");
const { getAllProducts, getSingleProduct } = require("./db");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World");
});

// Products Routes
router.get("/api/products", async (req, res, next) => {
  try {
    res.send(await getAllProducts());
  } catch (error) {
    next(error);
  }
});

router.get("/api/products/:id", (req, res) => {
  res.send("Get a single product");
});

module.exports = router;
