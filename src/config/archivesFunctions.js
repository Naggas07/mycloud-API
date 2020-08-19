const fs = require("fs");
const path = require("path");

const cloudPath = path.join(
  "/Users/naggas/Desktop/Proyectos/myCloud/src/uploads/users"
);

let dirs = fs
  .readdirSync(cloudPath)
  .filter((file) => fs.statSync(`${cloudPath}/${file}`).isDirectory());

let createDir = (dir, nameFolder) => {
  if (!fs.existsSync(`${dir}/${nameFolder}`)) {
    fs.mkdirSync(`${dir}/${nameFolder}`);
    return `${dir}/${nameFolder}`;
  } else {
    return `${dir}/${nameFolder} is already exist`;
  }
};

let deleteDir = (dir, nameFolder) => {
  if (fs.existsSync(`${dir}/${nameFolder}`)) {
    fs.rmdirSync(`${dir}/${nameFolder}`);
    return `${dir}/${nameFolder} is deleted`;
  } else {
    return `${dir}/${nameFolder} is not exist`;
  }
};

deleteFile = (dir, nameFile) => {
  fs.unlinkSync(`${dir}/${nameFile}`);
};

// deleteFile(directoryPath, "public.txt");

const moveFile = (file, storagePath) => {
  const filePath = `${storagePath}/${file.name}`;
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
};
