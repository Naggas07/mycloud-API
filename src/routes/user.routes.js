const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const rolMiddleware = require("../middlewares/rol.middlewares");

router.post(
  "/register",
  authMiddleware.isAuthenticated,
  rolMiddleware.isAdmin,
  userController.create
);
router.post("/login", authMiddleware.isNotAuthenticated, userController.login);
router.post("/logout", authMiddleware.isAuthenticated, userController.logout);
router.post(
  "/update/:id",
  authMiddleware.isAuthenticated,
  userController.updateUser
);

module.exports = router;
