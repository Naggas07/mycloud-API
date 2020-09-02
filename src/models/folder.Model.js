const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FolderSchema = new Schema(
  {
    parentFolder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    viewers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    editors: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = doc.id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

FolderSchema.virtual("childFolders", {
  ref: "childFolders",
  localField: "_id",
  foreignField: "files",
  justOne: false,
});

FolderSchema.virtual("Files", {
  ref: "File",
  localField: "_id",
  foreignField: "files",
  justOne: false,
});

const Folder = mongoose.model("Folder", FolderSchema);

module.exports = Folder;
