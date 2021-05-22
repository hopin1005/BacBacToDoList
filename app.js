var eventhandler = require('./event_handler');
	
const Express = require('express');
const BodyParser = require('body-parser');
const app = Express();

app.post('/linewebhook',eventhandler)

app.use(BodyParser.urlencoded({ extended: true }));
app.use(BodyParser.json());
app.use(Express.static("upload"));


app.listen(3000)


