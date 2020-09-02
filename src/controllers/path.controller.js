const fs = require("fs");
const path = require("path");

//routes
const archives = require("../config/archivesFunctions");
const Folder = require("../models/folder.Model");
const File = require("../models/file.Model");

module.exports.newFolder = (req, res, next) => {
  const id = req.params.id;
  const { name, path } = req.body;

  Folder.findOne({ name, parentFolder: id }).then((ok) => {
    if (!ok) {
      const folder = {
        name,
        owner: req.session.user.id,
        parentFolder: id,
      };
      console.log(folder);
      Folder.create(folder)
        .then((folder) => {
          archives.createDir(`${archives.cloudPath}/${path}`, name);
          res.status(200).json(folder);
        })
        .catch(next);
    } else {
      res.status(200).json({ message: "folder already exist" });
    }
  });
};

module.exports.deleteFolder = (req, res, next) => {
  const id = req.params.id;
  let { path } = req.body;

  let literalPath = path.replace("-", "/");

  File.find({ folder: id }).then((items) => {
    if (!items[0]) {
      Folder.findByIdAndDelete(id)
        .then((ok) => {
          let message = archives.deleteDir(
            `${archives.cloudPath}/${literalPath}/${ok.name}`
          );
          message = message.split("/").reverse()[0];
          res.json({ message });
        })
        .catch({ message: "error" });
    } else {
      res.status(500).json({ message: "files in this folder" });
    }
  });
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

module.exports.getFolders = (req, res, next) => {
  let id = req.params.id;

  console.log(id);
  Folder.findById(id)
    .populate("File")
    .populate("childs")
    .then((folders) => res.json(folders))
    .catch(next);
};
