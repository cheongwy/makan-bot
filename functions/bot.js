let nlu = require('./nlu.js');
let nlg = require('./nlg.js');

module.exports = function(controller) {

  // this doesn't seem to match correctly
  // controller.hears(['hello'], 'message_received', function(bot, message) {
  //   bot.reply(message, nlg.sayHi());
  // });

  controller.hears(['how[ ]+(are|r)[ ]+(you|u)[?]*'], 'message_received', function(bot, message) {
    bot.reply(message, nlg.respondToGreeting());
  });

  controller.hears(["how[']{0,1}[s]{0,1}[ ]+it[ ]+going[?]*"], 'message_received', function(bot, message) {
    bot.reply(message, nlg.respondToGreeting());
  });

  controller.hears(["(good){0,1}[ ]*bye", "ciao", "th(an){0,1}k(s){0,1}[ ]+(you|u)"], 'message_received', function(bot, message) {
    bot.reply(message, nlg.signOff());
  });

  controller.hears(["that([']{0,1}[s]{0,1}|[ ]+(wa|i)s)[ ]+good"], 'message_received', function(bot, message) {
    bot.reply(message, nlg.signOff());
  });

  controller.hears(['.*'], 'message_received', nlu.understand);

  return controller;
}
