const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Import models
const User = require("./User"); // Không cần truyền (sequelize)
const Game = require("./Game");
const Comment = require("./Comment");

// Định nghĩa quan hệ giữa các bảng
User.hasMany(Comment, { foreignKey: "user_id", onDelete: "CASCADE" });
Game.hasMany(Comment, { foreignKey: "game_id", onDelete: "CASCADE" });
Comment.belongsTo(User, { foreignKey: "user_id" });
Comment.belongsTo(Game, { foreignKey: "game_id" });

// Đồng bộ cơ sở dữ liệu (chỉ chạy một lần khi khởi tạo DB)
sequelize.sync({ alter: true })
    .then(() => console.log("Database synchronized"))
    .catch((error) => console.error("Error syncing database:", error));

// Xuất các models và kết nối Sequelize
module.exports = { sequelize, User, Game, Comment };
