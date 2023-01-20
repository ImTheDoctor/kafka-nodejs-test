const { Sequelize } = require('sequelize');

function dbConfig() {
    const sequelize = new Sequelize('postgres://postgres:postgres@127.0.0.1:5432/authdb');
    sequelize.authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
    sequelize.sync({ force: true }).then(() => {
        console.log(`Users table created!`)
    });
}

module.exports = { dbConfig }