const fs = require("fs");
const path = require("path");

//routes
const archives = require("../config/archivesFunctions");

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
  console.log(`${archives.cloudPath}/${path}`);

  let message = archives.deleteDir(`${archives.cloudPath}/${path}`);

  res.json({ message });
};
