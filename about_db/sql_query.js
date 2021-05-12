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


let query = (sql, callback) => {    
  pool.getConnection((err,conn) => {    
      if(err){
          callback(err,null,null);    
      }else{    
          conn.query(sql, (qerr,vals,fields) => {    
              
              conn.release();    
              
              callback(qerr, vals, fields);    
          });    
      }    
  })  
}

module.exports = query
