const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("MongoDB connected");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => console.error(err));








// Create a futuristic post
router.post("/create", verifyToken, async (req, res) => {
  try {
    const newPost = new Post({
      userId: req.user.id,
      caption: req.body.caption,
      imageUrl: req.body.imageUrl
    });
    const post = await newPost.save();
    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Like or unlike a post
router.put("/:id/like", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found." });

    const userIndex = post.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      post.likes.push(req.user.id);
    } else {
      post.likes.splice(userIndex, 1);
    }
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Add a comment to a post
router.post("/:id/comment", verifyToken, async (req, res) => {
  try {
    const comment = new Comment({
      userId: req.user.id,
      postId: req.params.id,
      text: req.body.text,
    });
    await comment.save();
    await Post.findByIdAndUpdate(req.params.id, { $push: { comments: comment._id } });
    res.status(201).json(comment);
  } catch (error) {
    console.error("Error commenting:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Retrieve all posts with user and comment data
router.get("/", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "username")
      .populate({ path: "comments", populate: { path: "userId", select: "username" } })
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;


// Add this to app.js after auth route setup:
// const postRoutes = require("./routes/post");
// app.use("/api/posts", postRoutes);
