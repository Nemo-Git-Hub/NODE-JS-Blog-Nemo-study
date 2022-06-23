const express = require("express");
const {
  getPost,
  deletePost,
  editPost,
  getPosts,
  addPost,
} = require("../controllers/api-post-controller");

const router = express.Router();

// Get All Posts
router.get("/api/posts", getPosts);
// Add New Post
router.post("/api/add-post", addPost);
// Get Post By ID
router.get("/api/post/:id", getPost);
// Delete Post By ID
router.delete("/api/post/:id", deletePost);
// Update Post By ID
router.put("/api/post/:id", editPost);

module.exports = router;
