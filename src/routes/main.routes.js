const express = require("express");
const router = express.Router();

// load principal routes
const userRoutes = require("./user.routes");
const filesRoutes = require("./files.routes");

router.get("/", (req, res, next) => {
  res.json({ message: "welcome to my app" });
});

//user routes

router.use("/user", userRoutes);
router.use("/files", filesRoutes);

module.exports = router;
