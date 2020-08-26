const fs = require("fs");
const path = require("path");

//routes
const archives = require("../config/archivesFunctions");
const { listenerCount } = require("../models/user.model");

module.exports.newFolder = (req, res, next) => {
  const path = req.params.path.split("-").join("/");
  const { name } = req.body;

  if (fs.existsSync(`${archives.cloudPath}/${path}/${name}`)) {
    res.status(404).json({ message: "folder already exist" });
  }

  archives.createDir(`${archives.cloudPath}/${path}`, name);

  res.status(200).json({ message: "folder created" });
};

module.exports.deleteFolder = (req, res, next) => {
  const path = req.params.path.split("-").join("/");

  let message = archives.deleteDir(`${archives.cloudPath}/${path}`);

  res.json({ message });
};

module.exports.getMyFolders = (req, res, next) => {
  let path = req.params.path.split("-");
  const mainFolder = path[0];
  path = path.join("/");

  if (req.session.user.folders.includes(mainFolder)) {
    res.status(200).json(archives.formatPath(path));
  } else {
    res.status(404).json({ message: "Forbidden" });
  }
};

module.exports.getAdminFolder = (req, res, next) => {
  let path = req.params.path.split("-");

  res.status(200).json(archives.formatPath(path));
};
