const express = require("express");

const {
  signUp,
  login,
  protect,
  logout,
  restrictTo,
} = require("../controller/authController");
const { getAllUser } = require("../controller/userController");

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/logout", logout);

//Protect all route after this middleware
router.get("/users", protect, restrictTo("admin"), getAllUser);

module.exports = router;
