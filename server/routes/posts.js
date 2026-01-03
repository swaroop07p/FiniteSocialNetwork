const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');

// POST a new message (The Battle Logic)
// server/routes/posts.js

// server/routes/posts.js

router.post('/', async (req, res) => {
  const { content, author } = req.body;
  const MAX_LIMIT = 100; // As per PS requirement

  try {
    const count = await Post.countDocuments();

    // Only attempt swap if we are at or above the limit
    if (count >= MAX_LIMIT) {
      // Find the "weakest" post (innovation: lowest likes)
      const weakest = await Post.findOne().sort({ likes: 1, createdAt: 1 });
      
      // Safety check: Only delete if a post was actually found
      if (weakest) {
        await Post.findByIdAndDelete(weakest._id);
        
        // Notify all clients that space was cleared
        if (req.io) {
          req.io.emit('post_swapped', { 
            deletedId: weakest._id,
            msg: "Space reclaimed for new content" 
          }); 
        }
      }
    }

    // Create the new post
    const newPost = new Post({ 
      content, 
      author, 
      likes: 0 
    });
    
    await newPost.save();

    // Real-time update for the frontend "Battle"
    if (req.io) {
      req.io.emit('post_created', newPost);
    }

    res.status(201).json(newPost);
  } catch (err) {
    console.error("SERVER CRASH DETAILS:", err); // Look at your terminal for this!
    res.status(500).json({ error: "Backend logic failed during broadcast." });
  }
});

// GET all posts
router.get('/', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

// LIKE a post
router.patch('/:id/like', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } }, // Increment likes by 1
      { new: true }
    );
    
    // Notify everyone in real-time that a post got a like!
    req.io.emit('post_liked', post);
    
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/like', async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // 1. One user one like check
    if (user.likedPosts.includes(req.params.id)) {
      return res.status(400).json({ msg: "Post already liked" });
    }

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    // 2. Add to user's liked list and save
    user.likedPosts.push(req.params.id);
    await user.save();

    // 3. BROADCAST: This sends the update to everyone instantly
    if (req.io) {
      req.io.emit('post_liked', post);
    }

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN DELETE ROUTE
// server/routes/posts.js

router.delete('/:id', async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    
    if (!deletedPost) {
      return res.status(404).json({ msg: "Post already gone" });
    }

    // Check if io exists before emitting to prevent 500 error
    if (req.io) {
      req.io.emit('post_deleted', req.params.id);
    }

    res.json({ msg: "Content successfully purged from finite space" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Server failed to process deletion" });
  }
});

module.exports = router;