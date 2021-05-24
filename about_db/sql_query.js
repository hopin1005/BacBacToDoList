const pool = require('./sql_config');

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
