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
//action template
var main_template = require('./bacbactemplate');
bacbactemplate = main_template['bacbactemplate'];
var action_template = main_template['action'];

//empty template
var empty_bacbactemplate = require('./empty_bacbactemplate');
empty_template = empty_bacbactemplate['empty_bacbactemplate'];


//del template
//push user input to del template
var deltemplate = require('./del_template.js');
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

app.listen(3000);


//when user follow
bot.on('follow', function(event){
	
	//create user data -> create user_template and deltemplate
	//insert data if user not exist 
	//maybe sql injection??
	var userid = event.source.userId;
	var tmp_template = JSON.stringify(bacbactemplate);
	
	var deltmp_template = JSON.stringify(del_template);
	var count = 0;

	
	sql_query = `insert into linebot (id, template, deltemplate, count) select * from (select'${userid}', '${tmp_template}', '${deltmp_template}', ${count}) as tmp where not exists (select id from linebot where id = '${userid}');`;

	query(sql_query, function(err, results){

        	if (err) {
                	console.log('Encountered an error:', err.message);
        	}

		
  		event.reply(["歡迎來到BacBacToDoList! 按下方按鈕開始吧! 還能上傳圖片置換上面!","如果程式怪怪的，先封鎖在追蹤就可以清除todolist囉!",empty_template]);
	});



});


//when user unfollow 
//delete user data
bot.on("unfollow", function(event){
	
	var sql_query = `delete from linebot where id = "${event.source.userId}";`;
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

	switch (true){
		case /^teachadd/.test(data):

			
			//get user_template from database
                        sql_query = mysql.format("select template from linebot where id = ?;", userid);
                        query(sql_query, function(err, results){
                                if (err) {
                                        console.log("Encountered an error:", err.message);
                                }
					
				
				//reply user template
				
				var res = JSON.parse(results[0].template);
				
				event.reply(["直接輸入想記錄的就可以囉!" , "你現在的ToDoList：", res])
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
			
			//split item value
			var remove_thing = data.split("=")[2];
			
			
			//delete item from database;
			//get deltemplate from database
			sql_query = mysql.format("select template,deltemplate,count from linebot where id = ?;", [userid]);

			query(sql_query, function(err, results){
                        	if (err) {
                                	console.log("Encountered an error:", err.message);
                        	}

				var res = JSON.parse(results[0].template);
				var delres = JSON.parse(results[0].deltemplate);
				var tmp_count = results[0].count;	
				
				//let's recorded list become one array
				record_list = [];
				var mainstruct = res.contents.body.contents[1].contents;
				mainstruct.forEach(function(value, index){
					
					record_list.push(value.contents[1].text);
					
				});
				

				//remove certain item using index;
				var index = record_list.indexOf(remove_thing);
				
				res = JSON.stringify(bacbactemplate);
				res = JSON.parse(res);
				
				delres = JSON.stringify(del_template);
				delres = JSON.parse(delres);

				if (index !== -1) {
 					 record_list.splice(index, 1);
				}else{
					event.reply("沒有找到你想刪除的!");
				}
					
				//push to new usertemplate
				
				if(record_list.length == 0){
					
					//empty user templare
					res = JSON.stringify(bacbactemplate);
					res = JSON.parse(res);
					
					//empty del template
					delres = JSON.stringify(del_template);
					delres = JSON.parse(delres);
					
					event.reply(["哇，你完成所有事情了!",res]);
					

				}else{
					tmp_count = 0;
					console.log(record_list)
					record_list.forEach(function(value,i){
						
						
						//caclute how many things be recorded
						tmp_count += 1;
						
						//user_template
                                        	action_template.contents[1].text = value;
						
						//magic bug?????????????????????????????????????
                                        	res.contents.body.contents[1].contents.push(action_template);
						console.log(res.contents.body.contents[1].contents[i]);

						//del_template

						/*var outter_index = parseInt(tmp_count / 3);
						
						push_template.action.data = `action=del&itemid=${value}`;
						push_template.action.label = value;
						
						if(tmp_count % 3 == 1 && tmp_count > 3){
							
							//push outter template
							delres.contents.contents.push(newcarousel);

						}
						if(tmp_count % 3 == 0){
							outter_index -= 1;
						}
                          			
						//push single inner template
						delres.contents.contents[outter_index].body.contents.push(push_template);*/

					})

				}
				console.log(res.contents.body.contents[1].contents[1])
				event.reply(res);

				//update db data;
				update(res, delres, userid, tmp_count);

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
	
	//add user any  input to template
	var input = event.message.text;
	var userid = event.source.userId;	

	//input data to action_template and del_template
	action_template.contents[1].text = input;

	//input data to del template
	push_template.action.data = `action=del&itemid=${input}`;
	push_template.action.label = input;

	//insert action_template to database;
	//get user_template from database;
	sql_query = mysql.format("select template, deltemplate, count from linebot where id = ?;", [userid]);
        query(sql_query, function(err, results){
        	if (err) {
                	console.log("Encountered an error:", err.message);
                }
		
		//record how many things user append;	
		//recording 9 things is max;	

		var tmp_count = results[0].count;
		var res = JSON.parse(results[0].template);
		var delres = JSON.parse(results[0].deltemplate);

		if (tmp_count > 8){

			//bigger than 8 , do nothing and return!
			event.reply(["你記下太多事了( > 9 )！先完成或刪除一些吧！", res]);
			return;

		}

		tmp_count += 1;

                //insert action_template to user_template;
		res.contents.body.contents[1].contents.push(action_template)

		//if count > 3, del block need append new columns in template
		var blockcount = parseInt(tmp_count / 3);
	
		if (tmp_count % 3 == 1 && tmp_count > 3){
			
			
			delres.contents.contents.push(newcarousel);
				
		}
		if(tmp_count % 3 == 0){
			blockcount = blockcount - 1;
		}
			
		delres.contents.contents[blockcount].body.contents.push(push_template);
		
		

		event.reply(["你現在的ToDoList：" , res]);
		
		//update database 
		update(res, delres, userid, tmp_count);
        });
	

})


function update(data, delres, userid, tmp_count){

	var temp_template = JSON.stringify(data);
        var deltemp_template = JSON.stringify(delres);


        var sql_query = `update linebot set template = '${temp_template}', deltemplate = '${deltemp_template}', count = '${tmp_count}' where id = '${userid}';`;

        query(sql_query, function(err, results){
        	if (err) {
                	console.log("Encountered an error:", err.message);
                }

	});
}
