// 1. Load Environment Variables
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

// Import the background cleanup task
const initCron = require('./utils/cron');

const app = express();

// 2. Create HTTP Server for Socket.io to sit on top of
const server = http.createServer(app);
const io = new Server(server, {
  cors: { 
    origin: "https://finite-social-network.vercel.app", // Allows your frontend to connect from any URL
    methods: ["GET", "POST"]
  }
});

// 3. Middleware
// app.use(cors());
app.use(cors({
  origin: "https://finite-social-network.vercel.app", // Your Vercel URL
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Add this under your other routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/posts', require('./routes/posts'));
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// This middleware passes the 'io' instance to every route
// This is how our routes can send "Real-time" updates to the frontend
app.use((req, res, next) => {
  req.io = io;
  next();
});

// 4. Database Connection
// It looks for MONGO_URI in your .env file first
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/finiteDB';

mongoose.connect(mongoURI)
  .then(() => console.log("🔥 Success: Database Connected to MongoDB Atlas"))
  .catch(err => console.log("❌ Database Connection Error:", err));

// 5. Routes
app.use('/api/posts', require('./routes/posts'));

// 6. Socket.io Connection Event
io.on('connection', (socket) => {
  console.log('⚔️  A user joined the battle for space. ID:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('🏳️  A user left the battle.');
  });
});

// 7. Initialize the "Innovation" Cron Job (The hourly janitor)
initCron(io);

// 8. Start the Server
// We use process.env.PORT for deployment, but default to 5000 for local dev
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Battle Server running on http://localhost:${PORT}`);
});