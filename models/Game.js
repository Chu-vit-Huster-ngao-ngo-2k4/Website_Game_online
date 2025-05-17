// Used for creating the Game model in the database
// The Game model has the following fields:
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Game = sequelize.define('Game', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'uncategorized'
    },
    iframe_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    thumbnail: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'Games',
    timestamps: true
});

// Tự động cập nhật database khi model thay đổi
Game.sync({ alter: true }).then(() => {
    console.log('Game table has been updated');
}).catch(err => {
    console.error('Error updating Game table:', err);
});

module.exports = Game;