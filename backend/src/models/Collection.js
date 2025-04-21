const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  records: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Record",
    },
  ],
  genre: [
    {
      type: String,
    },
  ],
  mood: [
    {
      type: String,
    },
  ],
  isPublic: {
    type: Boolean,
    default: true,
  },
  coverImage: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Collection = mongoose.model("Collection", collectionSchema);

module.exports = Collection;
