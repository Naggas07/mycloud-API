const express = require("express");
const router = express.Router();
const filesController = require("../controllers/files.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const rolMiddleware = require("../middlewares/rol.middlewares");

router.post(
  "/upload/:path",
  authMiddleware.isAuthenticated,
  authMiddleware.isPropietary,
  filesController.upload
);

router.post(
  "/rename/:path",
  authMiddleware.isAuthenticated,
  authMiddleware.isPropietary,
  filesController.rename
);

router.get(
  "/download/:path",
  authMiddleware.isAuthenticated,
  filesController.downloadFile
);

router.get(
  "/file/:path",
  authMiddleware.isAuthenticated,
  filesController.getFile
);

router.delete(
  "/delete/:path",
  authMiddleware.isAuthenticated,
  authMiddleware.isPropietary,
  filesController.deleteFile
);

router.delete(
  "/deleteMany",
  authMiddleware.isAuthenticated,
  authMiddleware.isPropietary,
  filesController.deleteMultipleFiles
);

module.exports = router;
