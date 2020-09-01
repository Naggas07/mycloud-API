const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FolderSchema = new Schema({
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
});
