const fs = require("fs");
const path = require("path");

const cloudPath = path.join(
  "/Users/naggas/Desktop/Proyectos/myCloud/src/uploads/users"
);

let dirs = fs
  .readdirSync(cloudPath)
  .filter((file) => fs.statSync(`${cloudPath}/${file}`).isDirectory());

let formatPath = (path) => {
  let dir = fs.readdirSync(`${cloudPath}/${path}`);

  return {
    folders: dir.filter((file) =>
      fs.statSync(`${cloudPath}/${path}/${file}`).isDirectory()
    ),
    files: dir.filter((file) =>
      fs.statSync(`${cloudPath}/${path}/${file}`).isFile()
    ),
  };
};

let createDir = (dir, nameFolder) => {
  if (!fs.existsSync(`${dir}/${nameFolder}`)) {
    fs.mkdirSync(`${dir}/${nameFolder}`);
    return `${dir}/${nameFolder}`;
  } else {
    return `${dir}/${nameFolder} is already exist`;
  }
};

let deleteDir = (dir, nameFolder) => {
  let path = !nameFolder ? dir : `${dir}/${nameFolder}`;
  if (fs.existsSync(path)) {
    fs.rmdirSync(path);
    return `${path} is deleted`;
  } else {
    return `${path} is not exist`;
  }
};

deleteFile = (dir, nameFile) => {
  let path = !nameFile ? dir : `${dir}/${nameFile}`;
  fs.unlinkSync(path);
};

// deleteFile(directoryPath, "public.txt");

const moveFile = (file, storagePath) => {
  const filePath = file.name.includes("-")
    ? `${storagePath}/${file.name.split("-").join("_")}`
    : `${storagePath}/${file.name}`;
  console.log(filePath);

  return new Promise((resolve, reject) => {
    fs.promises
      .access(filePath)
      .then(() => reject(new Error(`File ${file.name} already exists`)))
      .catch(() =>
        file.mv(filePath, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        })
      );
  });
};

module.exports = {
  cloudPath,
  createDir,
  deleteDir,
  moveFile,
  formatPath,
};
