const express = require("express");
const router = express.Router();
const filesController = require("../controllers/files.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const rolMiddleware = require("../middlewares/rol.middlewares");

router.post(
  "/upload/:id",
  authMiddleware.isAuthenticated,
  filesController.upload
);

router.post(
  "/rename/:id",
  authMiddleware.isAuthenticated,
  filesController.rename
);

router.get(
  "/download/:id",
  authMiddleware.isAuthenticated,
  filesController.downloadFile
);

router.get(
  "/file/:id",
  authMiddleware.isAuthenticated,
  filesController.getFile
);

router.delete(
  "/delete/:id",
  authMiddleware.isAuthenticated,
  filesController.deleteFile
);

router.delete(
  "/deleteMany/:id",
  authMiddleware.isAuthenticated,
  filesController.deleteMultipleFiles
);

router.get(
  "/size/:path",
  authMiddleware.isAuthenticated,
  filesController.getSizeFolder
);

module.exports = router;
