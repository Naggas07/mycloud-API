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
    path: {
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
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = doc.id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

FolderSchema.virtual("childs", {
  ref: "Folder",
  localField: "_id",
  foreignField: "parentFolder",
  justOne: false,
});

FolderSchema.virtual("files", {
  ref: "File",
  localField: "_id",
  foreignField: "folder",
  justOne: false,
});

const Folder = mongoose.model("Folder", FolderSchema);

module.exports = Folder;
