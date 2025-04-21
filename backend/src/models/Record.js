const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  discogsId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
  },
  coverImage: {
    type: String,
    required: true,
  },
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
  era: {
    type: String,
  },

  style: [
    {
      type: String,
    },
  ],
  format: [
    {
      type: String,
    },
  ],
  country: {
    type: String,
  },
  tracklist: [
    {
      position: String,
      title: String,
      duration: String,
    },
  ],
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Record = mongoose.model("Record", recordSchema);

module.exports = Record;
