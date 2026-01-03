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
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

// 3. SECURE LIKE (One User One Like System)
router.patch('/:id/like', async (req, res) => {
  const { userId } = req.body;

  try {
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User identity not found" });

    // THE SHIELD: Check if user already liked this specific post
    if (user.likedPosts.includes(req.params.id)) {
      return res.status(400).json({ msg: "You have already shielded this content!" });
    }

    // Update the Post likes
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    // Save the post ID to the user's likedPosts array
    user.likedPosts.push(req.params.id);
    await user.save();

    // Notify everyone in real-time
    if (req.io) {
      req.io.emit('post_liked', post);
    }

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