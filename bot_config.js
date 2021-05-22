function setup_linebot(){

	const result = require('dotenv').config();
	const linebot = require('linebot');

	const bot = linebot({
        	channelId: process.env.LINE_CHANNEL_ID,
        	channelSecret: process.env.LIEN_CHANNEL_SECRET,
        	channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
	});

	//const linebotParser = bot.parser();
	return bot
	//maybe need return linebotParser?

}


module.exports = setup_linebot;
