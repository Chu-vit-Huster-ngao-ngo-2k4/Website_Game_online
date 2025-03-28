const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comment = sequelize.define("Comment", {
    game_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
});

module.exports = Comment;