const fs = require("fs");
const path = require("path");

//routes
const archives = require("../config/archivesFunctions");
const Folder = require("../models/folder.Model");

module.exports.newFolder = (req, res, next) => {
  const path = req.params.path.split("-").join("/");
  const { name } = req.body;

  Folder.find({ name, owner: req.session.user.id }).then((ok) => {
    console.log(ok[0]);
    if (!ok[0]) {
      console.log("entra");
      const folder = {
        name,
        owner: req.session.user.id,
        parentFolder: path,
      };
      console.log(folder);
      Folder.create(folder)
        .then((folder) => {
          archives.createDir(`${archives.cloudPath}/${path}`, name);
          res.status(200).json({ ok: "folder created" });
        })
        .catch(next);
    } else {
      res.status(200).json({ message: "folder already exist" });
    }
  });
};

module.exports.deleteFolder = (req, res, next) => {
  const filtred = req.params.path.split("-");
  const parent = filtred.slice(0, filtred.length - 1).join("/");
  const name = filtred.reverse()[0];

  Folder.findOneAndDelete({ name, parentFolder: parent })
    .then((ok) => {
      let message = archives.deleteDir(
        `${archives.cloudPath}/${parent}/${name}`
      );
      res.json({ message });
    })
    .catch({ message: "errpr" });
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
