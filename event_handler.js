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


//import line bot setup function
var linebot_setup = require('./bot_config');
const bot = linebot_setup();
const linebotParser = bot.parser();



//handle user image
var ngrok_url = process.env.NGROK_URL;


//when user follow
bot.on('follow', function(event){

	var userId = event.source.userId;
	const create_func = require('./about_db/user_follow');

	create_func(userId);
	event.reply(["歡迎來到BacBacToDoList! 按下方按鈕開始吧! 還能上傳圖片置換上面!","如果程式怪怪的，先封鎖在追蹤就可以清除todolist囉!",empty_template]);

});


//when user unfollow 
//delete user data
bot.on("unfollow", function(event){
	
	var userid = event.source.userId;
	const del_func = require('./about_db/user_unfollow');
	console.log(del_func);
	del_func(userid);


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
	var image_name = ngrok_url;	
	//if user send image
	const message_func = require('./about_db/user_message');
	
	if(event.message.type == 'image'){

		event.message.content().then(function(content){
			
			//image name
			const {uuid} = require('uuidv4');
			image_name = uuid();

			var base64Data = content.toString('base64');
			fs.writeFile(`./upload/${image_name}.jpg`, base64Data, 'base64', function(err){
				console.log(err);
			});

			//update image_name to db;
			message_func.image(userId, image_name)
		});
	}
	
	

	//add user any  input to template
	var thingstodo = event.message.text;
	
	if(thingstodo != null){
		message_func.message(userId, thingstodo);	
	}
	
	//use callback
	setTimeout(getdata, 500)
	
	var datas;
	function getdata(){
		datas = message_func.getthings(userId);
		image_name = message_func.getimage(userId);
		
		setTimeout(() => {
			//waiting datas recv datas
			func_template.inserttemplate(datas, image_name, event);
		}, 500);
	}

})

module.exports = linebotParser;
