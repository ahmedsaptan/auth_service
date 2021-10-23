const express = require("express");
const router = express.Router();
const {
  checkAuth,
  checkPermission,
  extractUser,
} = require("../middlewares/auth");
const {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
  validate,
} = require("../controllers/product.controller");
const { ADMIN, SUPER_ADMIN, USER } = require("../constants");
router.use(checkAuth);
router.use(extractUser);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.post(
  "/",
  checkPermission([ADMIN, SUPER_ADMIN]),
  validate(),
  createProduct
);
router.put(
  "/:id",
  checkPermission([ADMIN, SUPER_ADMIN]),
  validate(),
  updateProduct
);
router.delete("/:id", checkPermission([SUPER_ADMIN]), deleteProduct);

module.exports = router;
