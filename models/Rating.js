const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Game = require('./Game');

const Rating = sequelize.define('Rating', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    gameId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Game,
            key: 'id'
        }
    }
}, {
    timestamps: true
});

// Associations
Rating.belongsTo(User, { foreignKey: 'userId' });
Rating.belongsTo(Game, { foreignKey: 'gameId' });

module.exports = Rating; 