const fs = require("fs");
const path = require("path");
const File = require("../models/file.Model");

//routes
const archives = require("../config/archivesFunctions");

module.exports.upload = async (req, res, next) => {
  const folder = req.params.path.split("-").join("/");
  const files = req.files.file;

  console.log(files);
  // usr id pending

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const createFile = (item, path, user) => {
    let itemFile = {
      name: item.name,
      path: path,
      size: item.size,
      encoding: item.encoding,
      type: item.mimetype,
      user,
    };

    return itemFile;
  };

  try {
    if (Array.isArray(files)) {
      console.log("entra en array");
      for (const file of files) {
        let item = createFile(file, folder);
        File.create(item);
        await archives.moveFile(file, `${archives.cloudPath}/${folder}/`);
      }
    } else {
      console.log("entra en no array");
      let item = createFile(files, folder);

      File.create(item);
      await archives.moveFile(files, `${archives.cloudPath}/${folder}/`);
    }
  } catch (err) {
    res.json({ message: "files not update" });
  }

  res.json({ message: "files updated" });
};

module.exports.unitUpload = (req, res, next) => {
  async (req, res, next) => {
    const folder = req.params.path.split("-").join("/");
    const files = req.files.file;

    console.log(files);

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    try {
      await archives.moveFile(files.file, `${archives.cloudPath}/${folder}/`);
    } catch (err) {
      res.json({ message: "file not update" });
    }

    res.json({ message: "file updated" });
  };
};

module.exports.rename = (req, res, next) => {
  const path = req.params.path.split("-").join("/");
  const { fileName, newName } = req.body;
  fs.renameSync(
    `${archives.cloudPath}/${path}/${fileName}`,
    `${archives.cloudPath}/${path}/${newName}.${fileName.split(".")[1]}`
  );

  res.json({ ok: "ok " });
};

module.exports.downloadFile = (req, res, next) => {
  const file = `${archives.cloudPath}/${req.params.path.split("-").join("/")}`;

  if (fs.existsSync(file)) {
    res.status(200).download(file);
  } else {
    res.status(404).json({ message: "file don´t exist" });
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
