const Sequelize = require('sequelize');

var config = {
    database: 'artogo', 
    username: 'artogo', 
    password: 'artogo', 
    host: 'localhost', 
    port: 3306 
};


var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
});

module.exports = sequelize;
