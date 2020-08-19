const express = require("express");
const router = express.Router();

// load principal routes
const userRoutes = require("./user.routes");
const filesRoutes = require("./files.routes");
const pathRoutes = require("./path.routes");

router.get("/", (req, res, next) => {
  res.json({ message: "Home ok" });
});

//user routes

router.use("/user", userRoutes);
router.use("/files", filesRoutes);
router.use("/paths", pathRoutes);

module.exports = router;
