// models/Comment.js
const CommentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  text: { type: String, required: true, trim: true },
}, { timestamps: true });

module.exports = mongoose.model("Comment", CommentSchema);
