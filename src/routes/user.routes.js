const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.post("/register", userController.create);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post("/update/:id", userController.updateUser);

module.exports = router;
