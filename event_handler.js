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

const message_func = require('./about_db/user_message');

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

	del_func(userid);

})


//postback function when user click template button
//1. teach how to add list & create user data in db
//2. show list
//3. popout deltemplate
//4. delete main function
bot.on('postback', function(event){
	var data = event.postback.data
	var userId = event.source.userId;
	
	switch (true){
		case /^teachadd/.test(data):
			event.reply("直接輸入想記錄的就可以囉");
			break;

		case /^show/.test(data):

			var datas = message_func.getthings(userId);
        		var image_name = message_func.getimage(userId);

			setTimeout(() => {
				getdata(datas, image_name , event)
			}, 500)
			break;
		
		case /^del/.test(data):
			
			//get user things from db;
			setTimeout(() => {
                		var infos_promise = message_func.getimage(userId);
                		var datas = message_func.getthings(userId);
                		deldata(datas, infos_promise, event);
        		}, 500)
			break;

		case /^action=del/.test(data):
			
			//split item value
                        var remove_thing = data.split("=")[2];
			
			var del_func = require('./about_db/user_del');
			del_func.deldata(userId, remove_thing);
			setTimeout(() => {
                                var infos_promise = message_func.getimage(userId);
                                var datas = message_func.getthings(userId);
                                getdata(datas, infos_promise, event);
                        }, 500)
                        
			break;

		default:
			event.reply("you may be wrong");

	}
	
})


//user input message will be added to list
bot.on('message', function(event){
	
	var userId = event.source.userId;
	var image_name = ngrok_url;	
	
	
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

	var infos_promise = message_func.getimage(userId);
	var count;

	infos_promise.then(data => {
		data = JSON.parse(data)
		count = parseInt(data[0].count)

		if(thingstodo != null){
			count += 1;
			message_func.message(userId, thingstodo, count);
		}
	})

	
		
	//use callback
	setTimeout(() => {
		var infos_promise = message_func.getimage(userId);
		var datas = message_func.getthings(userId);
		getdata(datas, infos_promise, event);
	},500)

})


function getdata(datas, infos_promise, event){
        setTimeout(() => {
        	//waiting datas recv datas
                func_template.inserttemplate(datas, infos_promise, event);
        },500);
}

function deldata(datas, infos_promise, event){
        setTimeout(() => {
                //waiting datas recv datas
                func_template.insertdeltemplate(datas, infos_promise, event);
        }, 500);
}

module.exports = linebotParser;
