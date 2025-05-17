const express = require("express");
const cors = require("cors");
const path = require("path");
const sequelize = require("./config/database");

const authRoutes = require("./routes/auth");
const gamesRoutes = require("./routes/games");
const commentRoutes = require('./routes/comments');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from both frontend and frontend/src directories
app.use(express.static(path.join(__dirname, 'frontend')));
app.use(express.static(path.join(__dirname, 'frontend', 'src')));

// Serve static files for CSS and other assets
app.use('/css', express.static(path.join(__dirname, 'frontend', 'css')));
app.use('/js', express.static(path.join(__dirname, 'frontend', 'src', 'js')));
app.use('/assets', express.static(path.join(__dirname, 'frontend', 'assets')));

app.use("/api/auth", authRoutes);
app.use("/api/games", gamesRoutes);
app.use('/api/comments', commentRoutes);

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'src', 'index.html'));
});

// Serve other HTML files
app.get('/:page', (req, res) => {
    const page = req.params.page;
    if (page.endsWith('.html')) {
        res.sendFile(path.join(__dirname, 'frontend', 'src', page));
    } else {
        res.sendFile(path.join(__dirname, 'frontend', 'src', 'index.html'));
    }
});

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
    app.listen(PORT, () => console.log(`🚀 Server chạy trên port ${PORT}`));
});
