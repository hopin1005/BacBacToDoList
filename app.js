const result = require('dotenv').config();
if (result.error) throw result.error

const linebot = require('linebot');
const Express = require('express');
const BodyParser = require('body-parser');

//store user image
var fs = require('fs');

//import sql connect function and config file
const query = require('./about_db/sql_query');
const mysql = require("mysql");
var updatedb = require("./about_db/updatedb");
updatedb = updatedb.updatedb;


//import template function
var func_template = require('./template_function/alter_template_func');


//import bacbac template
//full template
//action template
var main_template = require('./template_structure/bacbactemplate');
bacbactemplate = main_template['bacbactemplate'];
var action_template = main_template['action'];

//empty template
var empty_bacbactemplate = require('./template_structure/empty_bacbactemplate');
empty_template = empty_bacbactemplate['empty_bacbactemplate'];


//del template
//push user input to del template
var deltemplate = require('./template_structure/del_template');
del_template = deltemplate['deltemplate'];
push_template = deltemplate['pushtemplate'];
newcarousel = deltemplate['newcarousel'];


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

//handle user image
var ngrok_url = process.env.NGROK_URL;

app.use(Express.static("upload"));
app.listen(3000);


//when user follow
bot.on('follow', function(event){
	

	var userId = event.source.userId;

	//input empty things and count to database
	var count = 0;

	sql_query = `insert into user_info (userid) values ('${userId}');`;

	query(sql_query, function(err, results){

        	if (err) {
                	console.log('Encountered an error:', err.message);
        	}

	});

	sql_query = `insert into user_data (dataid, thingstodo, count) values ('${userId}', '', '${count}');`;
	query(sql_query, function(err, results){

		if(err){
			console.log('Encountered an error:' ,err.message);
		}
	
  		event.reply(["歡迎來到BacBacToDoList! 按下方按鈕開始吧! 還能上傳圖片置換上面!","如果程式怪怪的，先封鎖在追蹤就可以清除todolist囉!",empty_template]);
	});


});


//when user unfollow 
//delete user data
bot.on("unfollow", function(event){
	
	sql_query = `delete from user_data where dataid = '${event.source.userId}';`;

	query(sql_query, function(err, results){
		if(err) {
			console.log('Encountered an error:', err.message);
		}
	});


	sql_query = `delete from user_info where userid = "${event.source.userId}";`;
	query(sql_query, function(err, results){
                if (err) {
                        console.log('Encountered an error:', err.message);
                }
        });	

})


//postback function when user click template button
//1. teach how to add list & create user data in db
//2. show list
//3. popout deltemplate
//4. delete main function
bot.on('postback', function(event){
	var data = event.postback.data
	var userid = event.source.userId;
	var user_image_url = ngrok_url;
	

	switch (true){
		case /^teachadd/.test(data):
				
			event.reply(["直接輸入想記錄的就可以囉!"]);
			break;
		
		case /^show/.test(data):
			
			//get user_template from database
			sql_query = `select thingstodo from user_data where dataid = '${userid}';`;
			query(sql_query, function(err, results){
				if (err) {
					console.log("Encountered an error:", err.message);	
				}
				
				var things = results[0].thingstodo;
				var res = func_template.inserttemplate(things,user_image_url);
				
				event.reply(["你現在的ToDoList：" , res])
			});
			break;

		//teach delte and show deltemplate
		case /^del/.test(data):
			
			sql_query = `select thingstodo from user_data  where dataid = '${userid}'; `;
		
                        query(sql_query, function(err, results){
                                if (err) {
                                        console.log("Encountered an error:", err.message);
                                }
				
                                var things = results[0].thingstodo;
				var res = func_template.insertdeltemplate(things,user_image_url);

				event.reply(res);

			});
		
			
			break;


		case /^action=del/.test(data):
			
			//split item value
			var remove_thing = data.split("=")[2];
				
			//delete item from database;
			
			sql_query = `select thingstodo,count from user_data where dataid = '${userid}';`;

			query(sql_query, function(err, results){
                        	if (err) {
                                	console.log("Encountered an error:", err.message);
                        	}
				
				var things_array = [];
				things_array = results[0].thingstodo.split(',');
				things_array.shift();

				//remove certain item using index;
				var index = things_array.indexOf(remove_thing);
				

				if (index !== -1) {
 					things_array.splice(index, 1);
				}else{
					event.reply("沒有找到你想刪除的!");
				}
					
				//push to new usertemplate
				
				if(things_array.length == 0){
						
					event.reply(["哇，你完成所有事情了!"],);
					var things = "";
					count = 0;
					updatedb(userid, things, count);

				}else{
					var count = results[0].count;
					count -= 1;
					
					var things = "";
					things_array.forEach(function(value){
						things += ","; 
						things = things + value;
					})

					updatedb(userid, things, count);
					var user_template = func_template.inserttemplate(things_array, user_image_url);
					
					event.reply([user_template]);

				}


                	});

			
			break;
			
		default:
			//do nothing;
			event.reply("Ohhhhh, you may do wrong!");
			return;
	}
	
})


//user input message will be added to list
bot.on('message', function(event){
	
	var userId = event.source.userId;
	var user_image_url = ngrok_url;	
	//if user send image
	
	if(event.message.type == 'image'){

		event.message.content().then(function(content){
			var base64Data = content.toString('base64');
			fs.writeFile(`./upload/${userId}.jpg`, base64Data, 'base64', function(err){
				console.log(err);
			});
		});
		
		var url_array = ngrok_url.split("/");
		var domain = url_array[2];
		
		user_image_url = `https://${domain}/${userId}.jpg`;
		ngrok_url = user_image_url;
	}
	

	//add user any  input to template
	var input = event.message.text;
		
	
	//get thingstodo from db
	var sql_query = `select thingstodo, count from user_data where dataid = '${userId}';`;
	var things, count;
	
	query(sql_query, function(err, results){
                if (err) {
                        console.log("Encountered an error:", err.message);
                }
		
		things = results[0].thingstodo;
		count = results[0].count;
		
		//check if count > 8
		if(count > 8){
			event.reply(["你記下太多事了( > 9 )！先完成或刪除一些吧！"]);
			return;

		}
		if(event.message.type != "image"){
			count += 1;
			things = things + "," + input;
		}
		
		
		updatedb(userId, things, count);
		var user_template = func_template.inserttemplate(things, user_image_url);
		var del_template = func_template.insertdeltemplate(things, user_image_url);

		event.reply([user_template]);
        });

	
	
})


