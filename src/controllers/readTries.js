const fs = require("fs");
const path = require("path");

const directoryPath = path.join(
  "/Users/naggas/Desktop/Proyectos/myCloud/src/public"
);

let dirs = fs
  .readdirSync(directoryPath)
  .filter((file) => fs.statSync(`${directoryPath}/${file}`).isFile());

console.log(dirs);
