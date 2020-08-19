const fs = require("fs");
const path = require("path");

//routes
const archives = require("../config/archivesFunctions");

module.exports.upload = async (req, res, next) => {
  const folder = req.params.path;
  const files = req.files.file;

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
