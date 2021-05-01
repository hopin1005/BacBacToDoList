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

//del template
var del_template = require('./del_template.js');
del_template = del_template['deltemplate'];

var push_template = require('./del_template.js');
push_template = push_template['pushtemplate'];

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
	switch (true){
		case /^teachadd/.test(data):

			//create user data -> create user_template and deltemplate
			//insert data if user not exist 
			//maybe sql injection??
			
			var tmp_template = JSON.stringify(bacbactemplate);
			var deltmp_template = JSON.stringify(del_template);

			sql_query = "insert into linebot (id, template, deltemplate) select * from (select " + "'" + userid + "',"  + "'" + tmp_template + "'," + "'" + deltmp_template  +"'" + ") as tmp where not exists(select id from linebot where id = "+ "'" + userid + "'"  + ");";
		

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
		
		case /^show/.test(data):
			
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

		//teach delte and show deltemplate
		case /^del/.test(data):
			
			sql_query = mysql.format("select deltemplate from linebot where id = ?;", [userid]);

                        query(sql_query, function(err, results){
                                if (err) {
                                        console.log("Encountered an error:", err.message);
                                }

                                var res = JSON.parse(results[0].deltemplate);
				event.reply(res);

			});

			
			break;


		case /^action=del/.test(data):
			
			//del user data;
			//slice delete item
			var del_item = data.split("=")[2];
			

			//delete item from database;
			//get deltemplate from database
			sql_query = mysql.format("select deltemplate from linebot where id = ?;", [userid]);

			query(sql_query, function(err, results){
                        	if (err) {
                                	console.log("Encountered an error:", err.message);
                        	}

				var res = JSON.parse(results[0].deltemplate);

				//find item and delete
				console.log(res.template.columns[0].actions);

                	});


			//
			break;

			
		default:
			//do nothing;
			event.reply("Ohhhhh, you may do wrong!");
			return;
	}
	
})


//user input message will be added to list
bot.on('message', function(event){
	
	var userid = event.source.userId;
	
	//add user any  input to template
	var input = event.message.text;
	
	//input data to action_template and del_template
	action_template.contents[1].text = input;
	push_template.data = `action=del&itemid=${input}`;
	push_template.label = input;

	//insert action_template to database;
	//get user_template from database;
	sql_query = mysql.format("select template, deltemplate from linebot where id = ?;", [userid]);
        query(sql_query, function(err, results){
        	if (err) {
                	console.log("Encountered an error:", err.message);
                }

                //insert action_template to user_template;
		
		var res = JSON.parse(results[0].template);
		res.contents.body.contents[1].contents.push(action_template)
		
		var delres = JSON.parse(results[0].deltemplate);
		delres.template.columns[0].actions.push(push_template);
		
		event.reply(["你現在的ToDoList：" , res]);
		
		//update database 
		update(res, delres, userid);
        });
	
	//update database
	function update(data, delres, userid){
		
		var temp_template = JSON.stringify(data);
		var deltemp_template = JSON.stringify(delres);

		var sql_query = "update linebot set template = '"+ temp_template  + "' ,deltemplate = '" + deltemp_template + "' where id = '" + userid + "';";
		
		query(sql_query, function(err, results){
                	if (err) {
                        	console.log("Encountered an error:", err.message);
                	}
			
		});

	}

})

//todo 
//add id in database;
//add 0~2 -> new block
//id -> index -> del;
