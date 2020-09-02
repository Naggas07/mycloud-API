const express = require("express");
const router = express.Router();
const pathController = require("../controllers/path.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const rolMiddleware = require("../middlewares/rol.middlewares");

router.post(
  "/new/:path",
  authMiddleware.isAuthenticated,
  pathController.newFolder
);
router.post(
  "/delete/:path",
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

router.get("/path/:path", pathController.getFolders);

module.exports = router;
