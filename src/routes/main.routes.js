const express = require("express");
const router = express.Router();

// load principal routes
const userRoutes = require("./user.routes");

router.get("/", (req, res, next) => {
  res.json({ message: "welcome to my app" });
});

//user routes

router.use("/user", userRoutes);

module.exports = router;
