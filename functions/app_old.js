'use strict';

const functions = require('firebase-functions')

process.env.WIT_ACCESS_TOKEN = functions.config().wit.token
process.env.BONSAI_URL = functions.config().bonsai.url

let witClient = require('./wit-bot.js')
let searcher = require('./search/searcher.js')

exports.makanBot = functions.https.onRequest((req, res) => {
  console.log("Params ", req.query)
  let input = req.query.input
  if (!input && req.method === 'POST') {
    input = req.body.input
  }

  if (input === undefined) {
    res.status(400).send('No input is defined!');
  } else {
    witClient.message(input, {})
    .then((data) => {
      console.log("Wit answers", data);
      const food = witClient.getEntity(data.entities, 'search_query');
      if(food) {
        searcher.getSuggestions(food)
                .then(function (result) {
                  console.log("Returning answer");
                  res.json(result)
                })
      }
      else {
        res.json({})
      }
    })
    .catch(console.error)
  }
});
