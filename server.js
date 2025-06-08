const express = require("express");
const cors = require("cors");
const path = require("path");
const sequelize = require("./config/database");

const authRoutes = require("./routes/auth");
const gamesRoutes = require("./routes/games");
const commentRoutes = require('./routes/comments');
const ratingRoutes = require('./routes/ratingRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'frontend')));
app.use(express.static(path.join(__dirname, 'frontend', 'src')));

// Serve static files for CSS, JS and other assets
app.use('/css', express.static(path.join(__dirname, 'frontend', 'css')));
app.use('/js', express.static(path.join(__dirname, 'frontend', 'src', 'js')));
app.use('/images', express.static(path.join(__dirname, 'frontend', 'images')));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/games", gamesRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/ratings', ratingRoutes);

// Serve HTML files
const htmlFiles = {
    '/': 'index.html',
    '/admin': 'admin.html',
    '/play': 'play.html',
    '/login': 'login.html',
    '/register': 'register.html',
    '/profile': 'profile.html',
    '/register-admin': 'register-admin.html'
};

// Handle HTML routes
Object.entries(htmlFiles).forEach(([route, file]) => {
    app.get(route, (req, res) => {
        res.sendFile(path.join(__dirname, 'frontend', 'src', file));
    });
});

// Catch all other routes and serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'src', 'index.html'));
});

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
    app.listen(PORT, () => console.log(`🚀 Server chạy trên port ${PORT}`));
});
