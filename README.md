<h1>🌌 FINITE: The Scarce Digital Content Protocol</h1><br>
<h3>Digital space is infinite. Attention is not. Finite makes content survival a battle of value.</h3><br>

<h2>📖 The Concept</h2><br>
In a world of infinite scrolling and endless data hoarding, Finite introduces artificial scarcity. The platform has a hard-coded limit of 100 transmissions. Once the buffer is full, the community must decide what stays and what vanishes.<br>

This isn't just a social network; it's a digital ecosystem where:<br>

•Space is Earned: Only the most "Shielded" (Liked) content survives.<br>

•The Battle for Survival: When a new user broadcasts, the "weakest" transmission (the one with the lowest likes) is automatically purged from the database in real-time.<br>

•Zero Noise: Only the content the community values remains.<br>

<h2>🛠️ Tech Stack</h2><br>
•Frontend: React.js, Tailwind CSS (for that deep-space aesthetic), Lucide Icons.<br>

•Backend: Node.js, Express.js.<br>

•Real-Time: Socket.io for instantaneous "battle" updates and live comments.<br>

•Database: MongoDB Atlas (NoSQL) for high-performance content management.<br>

•Authentication: JWT (JSON Web Tokens) with encrypted password hashing.<br>

<h2>✨ Key Features</h2><br>
•The Swap Algorithm: Custom backend logic that monitors database capacity and performs a "purge-and-replace" based on engagement metrics.<br>

•Instagram-Style Interaction: Toggle-able "Shields" (Likes) and threaded "Transmissions" (Comments).<br>

•One-User-One-Like: Secure backend validation preventing spam and ensuring fair survival of content.<br>

•Real-Time Sync: No refreshing required. When a post is purged or liked, every connected user sees it happen live via WebSockets.<br>

•Admin Override: Dedicated administrative role for protocol maintenance and content purging.<br>

<h2>🚀 Technical Innovation (For Judges)</h2><br>
While most social apps focus on scaling up, Finite focuses on intelligent scaling down. The project solves the "100 post limit" challenge by implementing a weighted selection algorithm:<br>

•Priority 1: Like Count (The community choice).<br>

•Priority 2: Timestamp (Oldest content is purged if likes are tied).<br>

This ensures Data Integrity while maintaining a high-energy, real-time user experience.<br>

<h2>💻 Installation & Setup</h2><br>
1.Clone the Repo: git clone https://github.com/YOUR_USERNAME/finite-social-network.git<br>

2.Install Dependencies: npm install in both /client and /server.<br>

3.Environment Variables: Setup your .env with MONGO_URI, JWT_SECRET, and ADMIN_USER.<br>

4.Run Locally:<br>
client npm start<br>
server node server.js<br>
