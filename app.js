const result = require('dotenv').config();
if (result.error) throw result.error

const linebot = require('linebot');
const Express = require('express');
const BodyParser = require('body-parser');

//import bacbac template
var bacbactemplate = require('./bacbactemplate');
bacbactemplate = bacbactemplate['bacbactemplate'];

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



// echo user message
bot.on('message', function (event) {
  // get user message from `event.message.text`
  event.reply(bacbactemplate)
  
});

