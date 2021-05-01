const result = require('dotenv').config();
if (result.error) throw result.error

const linebot = require('linebot');
const Express = require('express');
const BodyParser = require('body-parser');

//import sql connect function and config file
const query = require('./sql_conn');
const mysql = require("mysql");



//import bacbac template
//full template
var bacbactemplate = require('./bacbactemplate');
bacbactemplate = bacbactemplate['bacbactemplate'];


//empty template
var empty_bacbactemplate = require('./empty_bacbactemplate');
empty_template = empty_bacbactemplate['empty_bacbactemplate'];

//action_template
var action_template = require('./action_template.js');
action_template = action_template['action'];


// Line Channel info
const bot = linebot({
  	channelId: process.env.LINE_CHANNEL_ID,
  	channelSecret: process.env.LIEN_CHANNEL_SECRET,
  	channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
});

const linebotParser = bot.parser();
const app = Express();

// for line webhook usage
app.post('/linewebhook', linebotParser);

app.use(BodyParser.urlencoded({ extended: true }));
app.use(BodyParser.json());

app.listen(3000);


//when user follow
bot.on('follow', function(event){
	
	event.reply([
  		"歡迎來到BacBacToDoList! 按下方按鈕開始吧! 還能上傳圖片置換上面!",empty_template]);

});


//when user unfollow 
//del user data


//postback function when user click template button
//1. teach how to add list & create user data in db
//2. show list
//3. alter list
bot.on('postback', function(event){

	var data = event.postback.data
	var userid = event.source.userId;
	switch (data){
		case 'teachadd':

			//create user data
			//insert data if user not exist
			//maybe sql injection??
			var tmp_template = JSON.stringify(bacbactemplate);
			
			sql_query = "insert into linebot (id, template) select * from (select " + "'" + userid + "',"  + "'" + tmp_template + "'" + ") as tmp where not exists(select id from linebot where id = "+ "'" + userid + "'"  + ");";

			query(sql_query, function(err, results){

                		if (err) {
                        		console.log('Encountered an error:', err.message);
                		}
        		});
			
			//get user_template from database
                        sql_query = mysql.format("select template from linebot where id = ?;", userid);
                        query(sql_query, function(err, results){
                                if (err) {
                                        console.log("Encountered an error:", err.message);
                                }
					
				
				//reply user template
				var res = JSON.parse(results[0].template);
				
				event.reply(["直接輸入想記錄的就可以囉!" , res])
                        });

			
			break;
		
		case 'show':
			
			//get user_template from database
			sql_query = mysql.format("select template from linebot where id = ?;", [userid]);
			query(sql_query, function(err, results){
				if (err) {
					console.log("Encountered an error:", err.message);	
				}
				
				//reply user template
				var res = JSON.parse(results[0].template);
				event.reply(["你現在的ToDoList：" , res])
			});
			break;
		

		case 'alter':
			break;

		
		default:
			return;
	}
	
})


//user input message will be added to list
bot.on('message', function(event){
	
	var userid = event.source.userId;
	
	//add user any  input to template
	var input = event.message.text;

	//input data to action_template
	action_template.contents[1].text = input;


	//insert action_template to database;
	//get user_template from database;
	sql_query = mysql.format("select template from linebot where id = ?;", [userid]);
        query(sql_query, function(err, results){
        	if (err) {
                	console.log("Encountered an error:", err.message);
                }

                //insert action_template to user_template;
		var res = JSON.parse(results[0].template);
		res.contents.body.contents[1].contents.push(action_template)
			
		event.reply(["你現在的ToDoList：" , res]);
		
		//update database 
		update(res, userid);
        });
	
	//update database
	function update(data, userid){
		
		var temp_template = JSON.stringify(data);
		
		var sql_query = "update linebot set template = '"+ temp_template  + "' where id = '" + userid + "';";
		query(sql_query, function(err, results){
                	if (err) {
                        	console.log("Encountered an error:", err.message);
                	}
			
		});

	}

})
