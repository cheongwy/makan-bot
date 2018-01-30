'use strict';

//let log = require('./logger').log;
let Wit = require('node-wit').Wit;

const firstEntityValue = (entities, entity) => {
  //log.debug({"entities":entities}, 'Searching thru entities');
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value
  ;
  console.log('Found entity',val);
  if (!val) {
    return null;
  }
  return (typeof val === 'object' && val.value) ? val.value : val;
};

const mostLikelyEntity = (entities) => {
  if(entities && Object.keys(entities).length > 0) {
    const sortedByConfidence = Object.keys(entities)
    .map(key => {
      return [key, entities[key]];
    }).sort((a,b) => {
      const ac = a[1][0].confidence;
      const bc = b[1][0].confidence;
      console.log('ac',a[1][0]);
      console.log('bc',b[1][0]);
      if(ac === bc) return 0;
      else if (ac > bc) return -1;
      else return 1;
    });
    console.log('Sorted entities',sortedByConfidence);
    const entity = sortedByConfidence[0];
    const entityType = entity[0];
    if(entityType === "search_query") {
      return { "type": "query", "value": entity[1][0].value }
    }
    else if(entityType === "greetings") {
      return { "type": "greeting" }
    }
  }
  else {
    return { "type": "error" }
  }

}

const accessToken = process.env.WIT_ACCESS_TOKEN;

const client = new Wit({accessToken});

exports.message = client.message;
exports.getEntity = mostLikelyEntity;
