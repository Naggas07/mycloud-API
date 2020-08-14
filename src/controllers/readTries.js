const fs = require("fs");
const path = require("path");

const directoryPath = path.join(
  "/Users/naggas/Desktop/Proyectos/myCloud/src/public"
);

fs.readdir(directoryPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err);
    console.log("hola");
  } else {
    let print = files.filter((fileEnt) => fileEnt.isFile());
    console.log(print);
  }
});
