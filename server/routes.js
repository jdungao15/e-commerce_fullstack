const express = require("express");
const {
  getAllProducts,
  getSingleProduct,
  createProduct,
  deleteProduct,
  addItemToCart,
  getAllUsers,
  findUserByToken,
  findUserByTokenAdmin,
  authenticate,
} = require("./db");
const router = express.Router();

const isLoggedin = async (req, res, next) => {
  console.log(req.headers.authorization);
  try {
    const user = await findUserByToken(req.headers.authorization);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await findUserByTokenAdmin(req.headers.authorization);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

router.get("/", (req, res) => {
  res.send("Hello World");
});

router.post("/api/auth/login", async (req, res, next) => {
  try {
    res.send(await authenticate(req.body.email, req.body.password));
    res.status(200);
  } catch (error) {
    next(error);
  }
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

// isLoggedin Middleware
router.post(
  "/api/users/:id/cart/:product_id",
  isLoggedin,
  async (req, res, next) => {
    try {
      res.send(
        await addItemToCart(
          req.params.id,
          req.params.product_id,
          req.body.quantity
        )
      );
      res.status(201);
    } catch (error) {
      next(error);
    }
  }
);

// Protected Routes Only for Admins
router.get("/api/users", isAdmin, async (req, res, next) => {
  try {
    res.send(await getAllUsers());
    res.status(200);
  } catch (error) {
    next(error);
  }
});
router.post("/api/products", isAdmin, async (req, res, next) => {
  try {
    res.send(await createProduct(req.body));
    res.status(201);
  } catch (error) {
    next(error);
  }
});

router.delete("/api/products/:id", isAdmin, (req, res) => {
  try {
    deleteProduct(req.params.id);
    res.status(204);
    res.send("Product deleted");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
