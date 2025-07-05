const router = require("express").Router();
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const verifyToken = require("../middleware/verifyToken");

// Create post
router.post("/create", verifyToken, async (req, res) => {
  try {
    const newPost = new Post({
      userId: req.user.id,
      caption: req.body.caption,
      imageUrl: req.body.imageUrl
    });
    const post = await newPost.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Like/unlike post
router.put("/:id/like", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.user.id)) {
      post.likes.push(req.user.id);
    } else {
      post.likes = post.likes.filter(uid => uid.toString() !== req.user.id);
    }
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Comment
router.post("/:id/comment", verifyToken, async (req, res) => {
  try {
    const comment = new Comment({
      userId: req.user.id,
      postId: req.params.id,
      text: req.body.text
    });
    await comment.save();
    await Post.findByIdAndUpdate(req.params.id, { $push: { comments: comment._id } });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all posts
router.get("/", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "username profilePic")
      .populate({ path: "comments", populate: { path: "userId", select: "username profilePic" } })
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
           
