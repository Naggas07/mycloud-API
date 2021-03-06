const fs = require("fs");
const path = require("path");

//routes
const archives = require("../config/archivesFunctions");
const Folder = require("../models/folder.Model");
const File = require("../models/file.Model");
const User = require("../models/user.model");

module.exports.newFolder = (req, res, next) => {
  const id = req.params.id;
  const { name, path } = req.body;

  Folder.findOne({ name, parentFolder: id }).then((ok) => {
    if (!ok) {
      const folder = {
        name,
        owner: req.session.user.id,
        parentFolder: id,
        path,
      };

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
  let id = req.params.id === "-" ? process.env.MAIN_FOLDER : req.params.id;

  Folder.findById(id)
    .populate("files")
    .populate("childs")
    .then((folders) => res.json(folders))
    .catch(next);
};

module.exports.getFolderUsers = (req, res, next) => {
  const { id } = req.params;

  Folder.findById(id)
    .then((okFolder) => {
      User.findById(okFolder.owner).then((owner) => {
        User.find({ _id: okFolder.editors }).then((editors) => {
          User.find({ _id: okFolder.viewers }).then((viewers) => {
            const users = {
              folder: {
                name: okFolder.name,
                path: okFolder.path,
              },
              viewers,
              editors,
              owner,
            };
            res.status(200).json(users);
          });
        });
      });
    })
    .catch(next);
};

module.exports.updateFolder = (req, res, next) => {
  const { id } = req.params;
  const { name, editors, viewers, path } = req.body;

  const toUpdate = {
    name,
    editors,
    viewers,
    path,
  };

  Folder.findByIdAndUpdate(id, toUpdate)
    .then((updated) => {
      fs.renameSync(
        `${archives.globalPath(path)}/${updated.name}`,
        `${archives.globalPath(path)}/${name}`
      );

      if (updated.name !== name) {
        Folder.updateMany(
          { path: `${path}/${updated.name}` },
          { path: `${path}/${name}` }
        )
          .then((foldersUpdated) => {
            File.updateMany(
              { path: `${path}/${updated.name}` },
              { path: `${path}/${name}` }
            ).then((filesUpadtes) => {
              res.status(200).json({ message: "folder Update" });
            });
          })
          .catch((err) => next(err));
      } else {
        res.status(200).json({ message: "folder Update" });
      }
    })
    .catch(next);
};

module.exports.foldersSize = (req, res, next) => {
  const path = req.params.path.replace("-", "/");

  Folder.find({ path: { $regex: path, $options: "i" } })
    .populate("files")
    .populate("childs")
    .then((folders) => {
      res.json(folders);
    })
    .catch(next);
};
