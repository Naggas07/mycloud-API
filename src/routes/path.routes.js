const express = require("express");
const router = express.Router();
const pathController = require("../controllers/path.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const rolMiddleware = require("../middlewares/rol.middlewares");

router.post("/new/:path", pathController.newFolder);
router.post("/delete/:path", pathController.deleteFolder);
router.get("/myPaths/:path", pathController.getMyFolders);

module.exports = router;
