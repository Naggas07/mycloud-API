const fs = require("fs");
const path = require("path");
const File = require("../models/file.Model");

//routes
const archives = require("../config/archivesFunctions");

module.exports.upload = async (req, res, next) => {
  const folder = req.params.path.split("-").join("/");
  const files = req.files.file;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const createFile = (item, path, id) => {
    let itemFile = {
      name: item.name,
      path: path,
      size: item.size,
      encoding: item.encoding,
      type: item.mimetype,
      user: id,
    };

    return itemFile;
  };

  try {
    if (Array.isArray(files)) {
      console.log("entra en array");
      for (const file of files) {
        let item = createFile(file, folder, req.session.user.id);
        File.create(item);
        await archives.moveFile(file, `${archives.cloudPath}/${folder}/`);
      }
    } else {
      console.log("entra en no array");
      let item = createFile(files, folder, req.session.user.id);
      File.create(item);
      await archives.moveFile(files, `${archives.cloudPath}/${folder}/`);
    }
  } catch (err) {
    res.json({ message: "files not update" });
  }

  res.json({ message: "files updated" });
};

module.exports.rename = (req, res, next) => {
  const path = req.params.path.split("-").join("/");
  const { fileName, newName } = req.body;
  let extension = fileName.split(".");

  File.findOneAndUpdate(
    { path: path, name: fileName },
    { name: `${newName}.${extension[extension.length - 1]}` }
  )
    .then((ok) => {
      fs.renameSync(
        `${archives.cloudPath}/${path}/${fileName}`,
        `${archives.cloudPath}/${path}/${newName}.${fileName.split(".")[1]}`
      );

      res.json({ ok: "ok " });
    })
    .catch((err) => err);
};

module.exports.downloadFile = (req, res, next) => {
  const file = `${archives.cloudPath}/${req.params.path.split("-").join("/")}`;

  if (fs.existsSync(file)) {
    res.status(200).download(file);
  } else {
    res.status(404).json({ message: "file don´t exist" });
  }
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
  const path = `${archives.cloudPath}/${req.params.split("-").join("/")}`;
  const { files } = req.body;
  let failFiles = [];

  if (!files) {
    res.status(404).json({ message: "No files to delete" });
  } else {
    files.map((file) => {
      let route = `${path}/${file}`;
      if (fs.existsSync(route)) {
        fs.unlinkSync(route);
        File.findByIdAndDelete({ path, name: file }).then((ok) => ok);
      } else {
        failFiles.push(file);
      }
    });
    if (failFiles) {
      res.status(404).json({ filesFailed: failFiles });
    } else {
      res.status(200).json({ message: "Files deleted" });
    }
  }
};

module.exports.getFile = (req, res, next) => {
  const file = `${archives.cloudPath}/${req.params.path.split("-").join("/")}`;
  console.log(file);
  if (fs.existsSync(file)) {
    res.sendFile(path.resolve(file));
  } else {
    res.status(404).json({ message: "file don´t exist" });
  }
};

module.exports.getFiles = (req, res, next) => {};
