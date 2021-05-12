var query = require('./sql_query');


function updatedb(userid, things, count){


        var sql_query = `update user_data set thingstodo = '${things}', count = ${count} where dataid = '${userid}';`;


        query(sql_query, function(err, results){
                if (err) {
                        console.log("Encountered an error:", err.message);
                }

        });
}

exports.updatedb = updatedb;
