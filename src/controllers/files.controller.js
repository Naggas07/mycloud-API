const fs = require("fs");
const path = require("path");
const File = require("../models/file.Model");
const Folder = require("../models/folder.Model");

//routes
const archives = require("../config/archivesFunctions");

module.exports.upload = async (req, res, next) => {
  const { id } = req.params;
  const { path } = req.body;
  const files = req.files.file;
  let itemsNoUpdate = [];

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const createFile = (item, folder, id) => {
    let itemFile = {
      name: item.name,
      path: path,
      folder: folder,
      size: item.size,
      encoding: item.encoding,
      type: item.mimetype,
      user: id,
    };

    return itemFile;
  };

  await Folder.findById(id).then(async (folder) => {
    try {
      if (Array.isArray(files)) {
        for (const file of files) {
          File.findOne({ path, name: file.name }).then(async (fileReview) => {
            if (!fileReview) {
              let item = createFile(file, folder.id, req.session.user.id);

              File.create(item);
              await archives.moveFile(file, `${archives.cloudPath}/${path}`);
            } else {
              itemsNoUpdate.push(file.name);
            }
          });
        }
      } else {
        File.findOne({ path, name: files.name }).then(async (fileReview) => {
          if (!fileReview) {
            let item = createFile(files, folder.id, req.session.user.id);

            File.create(item);
            await archives.moveFile(files, `${archives.cloudPath}/${path}`);
          } else {
            itemsNoUpdate.push(files.name);
          }
        });
      }
    } catch (err) {
      res.json({ message: "files not update" });
    }

    let message = "files updated";
    res.json({ message });
  });
};

module.exports.rename = (req, res, next) => {
  const { id } = req.params;
  const { newName } = req.body;

  File.findByIdAndUpdate(id, { name: newName })
    .then((ok) => {
      fs.renameSync(
        `${archives.cloudPath}/${ok.path}/${ok.name}`,
        `${archives.cloudPath}/${ok.path}/${newName}`
      );

      res.json({ ok: "ok " });
    })
    .catch((err) => res.json({ message: "error" }));
};

module.exports.downloadFile = (req, res, next) => {
  const { id } = req.params;

  File.findById(id)
    .then((ok) => {
      const file = `${archives.cloudPath}/${ok.path}/${ok.name}`;

      if (fs.existsSync(file)) {
        res.status(200).download(file);
      } else {
        res.status(404).json({ message: "file don´t exist" });
      }
    })
    .catch((err) => next(err));
};

module.exports.deleteFile = (req, res, next) => {
  const { id } = req.params;

  File.findById(id)
    .then((toDelete) => {
      const file = `${archives.globalPath(path)}/${toDelete.name}`;

      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
        File.findByIdAndDelete(id).then((del) => {
          res.status(200).json({ message: "File deleted" });
        });
      } else {
        res.status(404).json({ message: "file don´t exist" });
      }
    })
    .catch((err) => next(err));
};

module.exports.deleteMultipleFiles = (req, res, next) => {
  const { id } = req.params;
  const { files } = req.body;

  Folder.findById(id)
    .then((exist) => {
      if (exist) {
        files.map((fileId) => {
          File.findByIdAndDelete(fileId).then((toDelete) => {
            let file = `${archives.globalPath(path)}/${toDelete.name}`;

            if (fs.existsSync(file)) {
              fs.unlinkSync(file);
            }
          });
        });
        res.status(200).json({ message: "files deleted" });
      }
    })
    .catch((err) => res.status(404).json({ message: "folder not found" }));
};

module.exports.getFile = (req, res, next) => {
  const { id } = req.params;

  File.findById(id)
    .then((ok) => {
      const file = `${archives.globalPath(path)}/${ok.name}`;

      if (fs.existsSync(file)) {
        res.sendFile(path.resolve(file));
      } else {
        res.status(404).json({ message: "file don´t exist" });
      }
    })
    .catch((err) => next(err));
};

module.exports.pathSize = (req, res, next) => {
  const internalPath = req.params.path
    ? req.params.path.split("-").join("/")
    : "";

  File.find({ path: internalPath })
    .then((items) => {
      items.reduce();
      res.status(200).json(items);
    })
    .catch((err) => next);
};
