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

//full expect json data
const util = require('util');

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
  		"歡迎來到BacBacToDoList! 按下方按鈕開始吧! 還能上傳圖片置換上面的白囉!",empty_template]);

});


//when user unfollow 
//del user data


//postback function when user click template button
//1. teach how to add list & create user data in db
//2. show list
//3. alter list
bot.on('postback', function(event){

	var data = event.postback.data
	switch (data){
		case 'teachadd':
			//create user data
			var userid = event.source.userId;
			
			//insert data if user not exist
			//maybe sql injection?? 
			tmp_template = util.inspect(bacbactemplate, {showHidden: false, depth: null})
			sql_query = 'insert into linebot (id, template) select * from (select ' + '"' + userid + '",' + '"' + tmp_template  + '"' + ') as tmp where not exists(select id from linebot where id = '+ '"' + userid + '"'  + ');';


			query(sql_query, function(err, results){

                		if (err) {
                        		console.log('Encountered an error:', err.message);
                        		return res.send(500, err.message);
                		}
        		});


			event.reply(["直接輸入你想記錄的事情就可以囉!", bacbactemplate])
			break;
		
		case 'show':
			event.reply(["你現在的ToDoList：" , bacbactemplate])
			break;

		case 'alter':
			break;

		//default is add to ToDoList
		default:
			event.reply("ddd");
	}
	
})


//user input message
//1. add to list
bot.on('message', function(event){
	
	event.reply(event.source.userId);

})
