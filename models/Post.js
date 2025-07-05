// Post.js// models/Post.js
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  caption: { type: String, trim: true },
  imageUrl: { type: String },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
}, { timestamps: true });

module.exports = mongoose.model("Post", PostSchema);
- backend logic placeholder
