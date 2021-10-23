const express = require("express");
const router = express.Router();

const {
  login,
  register,
  validateLogin,
  validateRegister,
  logout,
  validateRefreshToken,
  refreshToken,
  validateLogout,
} = require("../controllers/auth.controller");

router.post("/login", [validateLogin()], login);
router.post("/register", [validateRegister()], register);
router.post("/logout", validateLogout(), logout);
router.post("/refresh-token", validateRefreshToken(), refreshToken);

module.exports = router;
