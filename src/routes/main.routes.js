const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.json({ message: "welcome to my app" });
});

module.exports = router;
