const express = require("express");
const {
  getAllProducts,
  getSingleProduct,
  createProduct,
  deleteProduct,
} = require("./db");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World");
});

// Products Routes
// Unprotected Routes
router.get("/api/products", async (req, res, next) => {
  try {
    res.send(await getAllProducts());
    res.status(200);
  } catch (error) {
    next(error);
  }
});

router.get("/api/products/:id", async (req, res, next) => {
  try {
    res.send(await getSingleProduct(req.params.id));
    res.status(200);
  } catch (error) {
    next(error);
  }
});

// Protected Routes Only for Admins
router.post("/api/products", async (req, res, next) => {
  try {
    res.send(await createProduct(req.body));
    res.status(201);
  } catch (error) {
    next(error);
  }
});

router.delete("/api/products/:id", (req, res) => {
  try {
    deleteProduct(req.params.id);
    res.status(204);
    res.send("Product deleted");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
