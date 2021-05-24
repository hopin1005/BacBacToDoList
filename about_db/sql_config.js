//import .env file
const result = require('dotenv').config();
if(result.error) throw result.error


var mysql = require('mysql');

var pool = mysql.createPool({

        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASS,
        database: process.env.MYSQL_DB

});

module.exports = pool;
