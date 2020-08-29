const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    path: {
      type: String,
    },
    size: {
      type: Number,
    },
    encoding: {
      type: String,
    },
    type: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
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

const File = mongoose.model("File", FileSchema);

module.exports = File;
