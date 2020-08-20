const fs = require("fs");
const path = require("path");

//routes
const archives = require("../config/archivesFunctions");

module.exports.upload = async (req, res, next) => {
  const folder = req.params.path.split("-").join("/");
  const files = req.files.file;

  console.log(files);

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  try {
    for (const file of files) {
      await archives.moveFile(file, `${archives.cloudPath}/${folder}/`);
    }
  } catch (err) {
    res.json(err);
  }

  res.json({ message: "files updated" });
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
