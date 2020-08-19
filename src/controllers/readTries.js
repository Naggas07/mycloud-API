const fs = require("fs");
const path = require("path");

const directoryPath = path.join(
  "/Users/naggas/Desktop/Proyectos/myCloud/src/public"
);

let dirs = fs
  .readdirSync(directoryPath)
  .filter((file) => fs.statSync(`${directoryPath}/${file}`).isDirectory());

console.log(dirs);

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

deleteFile(directoryPath, "public.txt");
