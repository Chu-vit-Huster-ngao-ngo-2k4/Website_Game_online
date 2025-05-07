const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Game = require('./Game');

const Comment = sequelize.define('Comment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    gameId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Games',
            key: 'id'
        }
    }
}, {
    tableName: 'Comments',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});

// Define associations
Comment.belongsTo(User, { as: 'User', foreignKey: 'userId' });
Comment.belongsTo(Game, { foreignKey: 'gameId' });

module.exports = Comment;