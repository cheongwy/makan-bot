const functions = require('firebase-functions');
const cors = require('cors')({origin: true});

process.env.WIT_ACCESS_TOKEN = functions.config().wit.token;
process.env.BONSAI_URL = functions.config().bonsai.url;
process.env.BOT_ID = functions.config().ms.bot.id;
process.env.BOT_PASSWD = functions.config().ms.bot.passwd;

const express = require('express');
let app = express();
//app.use(express.cors());

let searcher = require('./search/searcher.js')
let indexer = require('./search/indexer.js')
let witClient = require('./wit-bot.js')

let Botkit = require('botkit');

let controller = Botkit.botframeworkbot({});

let bot = controller.spawn({
  appId: process.env.BOT_ID,
  appPassword: process.env.BOT_PASSWD
});

const understand = (bot, message) => {
  console.log("Got message", message);
  bot.reply(message, { type: "typing" });
  witClient.message(message.text, {})
  .then((data) => {
    console.log("Wit answers", JSON.stringify(data));
    const entity = witClient.getEntity(data.entities);
    console.log("Wit entity", JSON.stringify(entity));
    if(entity.type === "query") {
      const query = entity.value;
      console.log("Searching for answer", JSON.stringify(query));
      searcher.getSuggestions(query)
              .then(function (result) {
                console.log("Returning answer");
                reply(bot, result, message)
              })
    }
    else if(entity.type === "greeting") {
      bot.reply(message, "Good day! What food do you fancy today?");
    }
    else {
      bot.reply(message, "I'm sorry but I didn't get you");
    }
  })
  .catch(console.error)
}

const reply = (bot, response, message) => {
  if(response.hits &&
      response.hits.hits.length > 0 ) {
    var hit = response.hits.hits[0]._source;
    var answer = hit.title + ' at ' + hit.content;
    bot.reply(message, answer)
  } else {
    bot.reply(message, "Sorry, I'm not sure what you are looking for.")
  }
}

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

const cannedGreetings = [
  "Not bad at all. What bib gourmand recommendations would you like?",
  "Well and good! Feeling hungry? I'm ready to make some recommendations."
];

const respondToGreeting = (bot, message) => {
  let max = cannedGreetings.length;
  let greeting = cannedGreetings[getRandomInt(0,max)];
  bot.reply(message, greeting);
}

const cannedSignOff = [
  "Hope that was useful. Bye!!",
  "Ciao! Glad I was of help.",
  "My pleasure!",
  "See you again soon!",
  "Tada!"
];

const signOff = (bot, message) => {
  let max = cannedSignOff.length;
  let signOff = cannedSignOff[getRandomInt(0,max)];
  bot.reply(message, signOff);
}

controller.hears(['how[ ]+(are|r)[ ]+(you|u)[?]*'], 'message_received', function(bot, message) {
  respondToGreeting(bot, message);
});

controller.hears(["how[']{0,1}[s]{0,1}[ ]+it[ ]+going[?]*"], 'message_received', function(bot, message) {
  respondToGreeting(bot, message);
});

controller.hears(["(good){0,1}[ ]*bye", "ciao", "th(an){0,1}k(s){0,1}[ ]+(you|u)"], 'message_received', function(bot, message) {
  signOff(bot, message);
});

controller.hears(["that([']{0,1}[s]{0,1}|[ ]+(wa|i)s)[ ]+good"], 'message_received', function(bot, message) {
  signOff(bot, message);
});

controller.hears(['.*'], 'message_received', understand);

exports.makanBot = functions.https.onRequest(app);
controller.createWebhookEndpoints(app, bot, function() {
    console.log('Starting up Makan buddy...');
});

// let port = 3001;
// app.listen(port, function(){
//   console.log('listening on port ' + port);
// });
