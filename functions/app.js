const cors = require('cors')({origin: true});
const express = require('express');
const bodyParser = require('body-parser');

const functions = require('firebase-functions');

process.env.WIT_ACCESS_TOKEN = functions.config().wit.token;
process.env.BONSAI_URL = functions.config().bonsai.url;
process.env.BOT_ID = functions.config().ms.bot.id;
process.env.BOT_PASSWD = functions.config().ms.bot.passwd;

var webserver = express();
webserver.use(bodyParser.json());
webserver.use(bodyParser.urlencoded({ extended: true }));
webserver.use(cors);

let Botkit = require('botkit');
let bot_options = {};
// Create the Botkit controller, which controls all instances of the bot.
//let controller = Botkit.socketbot(bot_options);

let controller = require('./bot.js')(Botkit.socketbot(bot_options));

webserver.use(express.static('public'));
webserver.post('/ask', function(req, res) {
    // Now, pass the webhook into be processed
    //console.log("Received request", req);
    controller.handleWebhookPayload(req, res);
});

controller.webserver = webserver;
controller.httpserver = webserver;

exports.makanBot = functions.https.onRequest(webserver);


// var http = require('http');
// var server = http.createServer(webserver);
// let port = 3001;
// server.listen(port, null, function() {
//     console.log('Express webserver configured and listening at http://localhost:' + port);
// });

// Open the web socket server
controller.openSocketServer(controller.httpserver);

// // Start the bot brain in motion!!
//controller.startTicking();
