const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');

// 1. BROADCAST NEW MESSAGE (The Battle Logic)
router.post('/', async (req, res) => {
  const { content, author } = req.body;
  const MAX_LIMIT = 100;

  try {
    const count = await Post.countDocuments();

    if (count >= MAX_LIMIT) {
      const weakest = await Post.findOne().sort({ likes: 1, createdAt: 1 });
      if (weakest) {
        await Post.findByIdAndDelete(weakest._id);
        if (req.io) {
          req.io.emit('post_swapped', { 
            deletedId: weakest._id,
            msg: "Space reclaimed for new content" 
          }); 
        }
      }
    }

    const newPost = new Post({ content, author, likes: 0 });
    await newPost.save();

    if (req.io) {
      req.io.emit('post_created', newPost);
    }

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: "Backend logic failed during broadcast." });
  }
});

// 2. GET ALL POSTS
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    // Force return an empty array if nothing is found
    res.json(posts || []); 
  } catch (err) {
    res.status(500).json([]); // Send empty array even on error to prevent crash
  }
});

// 3. SECURE LIKE (One User One Like System)
router.patch('/:id/like', async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    const post = await Post.findById(req.params.id);
    
    const isLiked = user.likedPosts.includes(req.params.id);

    if (isLiked) {
      // UNLIKE: Remove from user list and decrement post
      user.likedPosts = user.likedPosts.filter(id => id.toString() !== req.params.id);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      // LIKE: Add to user list and increment post
      user.likedPosts.push(req.params.id);
      post.likes += 1;
    }

    await user.save();
    await post.save();

    if (req.io) req.io.emit('post_liked', post);
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. ADD COMMENT
router.post('/:id/comment', async (req, res) => {
  const { text, username } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    const newComment = { text, username, createdAt: new Date() };
    
    post.comments.push(newComment);
    await post.save();

    // Broadcast the updated post with new comments to everyone
    if (req.io) req.io.emit('post_liked', post); 
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. ADMIN DELETE ROUTE
router.delete('/:id', async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) return res.status(404).json({ msg: "Post already gone" });

    if (req.io) {
      req.io.emit('post_deleted', req.params.id);
    }

    res.json({ msg: "Content successfully purged" });
  } catch (err) {
    res.status(500).json({ error: "Server failed to process deletion" });
  }
});

module.exports = router;