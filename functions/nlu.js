let searcher = require('./search/searcher.js')
let indexer = require('./search/indexer.js')
let witClient = require('./wit-client.js')
let nlg = require('./nlg.js');

const understand = (bot, message) => {
  console.log("Got message", message);
  //bot.reply(message, { type: "typing" });
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
      bot.reply(message, nlg.sayHi());
    }
    else {
      bot.reply(message, nlg.notUnderstand());
    }
  })
  .catch((e) => {
    bot.reply(message, "Sorry. I'm encountering some issues. Would you mind rephrasing?");
    console.error(e)
  });
}

const reply = (bot, response, message) => {
  if(response.hits &&
      response.hits.hits.length > 0 ) {
    var hit = response.hits.hits[0]._source;
    var answer = nlg.answer(hit.title + ' at ' + hit.content);
    bot.reply(message, answer)
  } else {
    bot.reply(message, nlg.noAnswer());
  }
}


exports.understand = understand;
