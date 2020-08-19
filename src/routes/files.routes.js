const express = require("express");
const router = express.Router();
const filesController = require("../controllers/files.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const rolMiddleware = require("../middlewares/rol.middlewares");

router.post("/upload/:path", filesController.upload);
router.post("/rename/:path", filesController.rename);

module.exports = router;
