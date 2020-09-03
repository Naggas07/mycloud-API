const fs = require("fs");
const path = require("path");
const File = require("../models/file.Model");
const Folder = require("../models/folder.Model");

//routes
const archives = require("../config/archivesFunctions");

module.exports.upload = async (req, res, next) => {
  const id = req.params.id;
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
            console.log(fileReview);
            if (!fileReview) {
              let item = createFile(file, folder.id, req.session.user.id);

              File.create(item);
              await archives.moveFile(file, `${archives.cloudPath}/${path}`);
            } else {
              console.log("Entra en fallo");
              console.log(file.name);
              itemsNoUpdate.push(file.name);
            }
          });
        }
      } else {
        console.log("entra en no array");
        File.findOne({ path, name: file.name }).then(async (fileReview) => {
          console.log(fileReview);
          if (!fileReview) {
            let item = createFile(file, folder.id, req.session.user.id);

            File.create(item);
            await archives.moveFile(file, `${archives.cloudPath}/${path}`);
          } else {
            console.log("Entra en fallo");
            console.log(file.name);
            itemsNoUpdate.push(file.name);
          }
        });
      }
    } catch (err) {
      res.json({ message: "files not update" });
    }

    console.log("items ", itemsNoUpdate);
    let message = (await !itemsNoUpdate)
      ? "files updated"
      : `items not updates`;
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
  const allPath = req.params.path.split("-");
  const file = `${archives.cloudPath}/${allPath.join("/")}`;
  const path = allPath.slice(0, allPath.length - 1).join("/");
  const fileName = allPath[allPath.length - 1];

  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    File.findOneAndDelete({ path, name: fileName }).then((del) => {
      res.status(200).json({ message: "File deleted" });
    });
  } else {
    res.status(404).json({ message: "file don´t exist" });
  }
};

module.exports.deleteMultipleFiles = (req, res, next) => {
  const path = `${archives.cloudPath}/${req.params.path.split("-").join("/")}`;
  const { files } = req.body;
  let failFiles = [];

  if (!files) {
    res.status(404).json({ message: "No files to delete" });
  } else {
    files.map((file) => {
      let route = `${path}/${file}`;

      if (fs.existsSync(route)) {
        fs.unlinkSync(route);
        File.findOneAndDelete({
          path: `${req.params.path.split("-").join("/")}`,
          name: file,
        }).then((ok) => ok);
      } else {
        failFiles.push(file);
      }
    });
    if (failFiles.length > 0) {
      res.status(404).json({ filesFailed: failFiles });
    } else {
      res.status(200).json({ message: "Files deleted" });
    }
  }
};

module.exports.getFile = (req, res, next) => {
  const file = `${archives.cloudPath}/${req.params.path.split("-").join("/")}`;

  if (fs.existsSync(file)) {
    res.sendFile(path.resolve(file));
  } else {
    res.status(404).json({ message: "file don´t exist" });
  }
};

module.exports.getFiles = (req, res, next) => {};

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
