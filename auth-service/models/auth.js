const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            isEmail: true, 
            allowNull: false,
            unique: true 
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                is: /^[0-9a-f]{64}$/i 
            }
        }
    }, {
        timestamps: false,
    });
    return User;
}