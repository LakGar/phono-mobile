const mongoose = require("mongoose");

const userPreferencesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  likedGenres: [
    {
      type: String,
    },
  ],
  likedArtists: [
    {
      type: String,
    },
  ],
  likedAlbums: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Record",
    },
  ],
  recommendedArtists: [
    {
      type: String,
    },
  ],
  recommendedAlbums: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Record",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Record",
    },
  ],
  collections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
    },
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
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

const UserPreferences = mongoose.model(
  "UserPreferences",
  userPreferencesSchema
);

module.exports = UserPreferences;
