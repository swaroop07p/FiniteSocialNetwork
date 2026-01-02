const cron = require('node-cron');
const Post = require('../models/Post');

// This runs every hour (at minute 0)
const initCron = (io) => {
  cron.schedule('0 * * * *', async () => {
    console.log('Running hourly cleanup...');
    
    const count = await Post.countDocuments();
    
    if (count > 90) {
      // Find the post with 0 likes and delete the oldest one
      const postToDelete = await Post.findOne({ likes: 0 }).sort({ createdAt: 1 });
      
      if (postToDelete) {
        await Post.findByIdAndDelete(postToDelete._id);
        // Notify the frontend that a post was "purged"
        io.emit('post_purged', postToDelete._id);
        console.log(`Purged post: ${postToDelete._id}`);
      }
    }
  });
};

module.exports = initCron;