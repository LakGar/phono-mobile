const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["blog", "sell", "buy"],
    required: true,
  },
  records: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Record",
    },
  ],
  price: {
    type: Number,
  },
  images: [
    {
      type: String,
    },
  ],
  condition: {
    type: String,
    enum: ["new", "like_new", "very_good", "good", "fair", "poor"],
  },
  location: {
    type: String,
  },
  status: {
    type: String,
    enum: ["active", "sold", "closed"],
    default: "active",
  },
  tags: [
    {
      type: String,
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      content: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
