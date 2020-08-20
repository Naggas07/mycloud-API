const express = require("express");
const router = express.Router();
const filesController = require("../controllers/files.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const rolMiddleware = require("../middlewares/rol.middlewares");

router.post(
  "/upload/:path",
  authMiddleware.isAuthenticated,
  filesController.upload
);
router.post(
  "/rename/:path",
  authMiddleware.isAuthenticated,
  filesController.rename
);

router.get(
  "/download/:path",
  authMiddleware.isAuthenticated,
  filesController.downloadFile
);

module.exports = router;
