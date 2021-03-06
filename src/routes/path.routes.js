const express = require("express");
const router = express.Router();
const pathController = require("../controllers/path.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const rolMiddleware = require("../middlewares/rol.middlewares");

router.post(
  "/new/:id",
  authMiddleware.isAuthenticated,
  pathController.newFolder
);
router.post(
  "/delete/:id",
  authMiddleware.isAuthenticated,
  pathController.deleteFolder
);
router.get(
  "/myPaths/:path",
  authMiddleware.isAuthenticated,
  pathController.getMyFolders
);

router.get(
  "/admin/:path",
  authMiddleware.isAuthenticated,
  rolMiddleware.isAdmin,
  pathController.getAdminFolder
);

router.get(
  "/path/:id",
  authMiddleware.isAuthenticated,
  pathController.getFolders
);

router.put(
  "/update/:id",
  authMiddleware.isAuthenticated,
  pathController.updateFolder
);

router.get(
  "/users/:id",
  authMiddleware.isAuthenticated,
  pathController.getFolderUsers
);

router.get(
  "/sizes/:path",
  authMiddleware.isAuthenticated,
  authMiddleware.isEditor,
  pathController.foldersSize
);

module.exports = router;
