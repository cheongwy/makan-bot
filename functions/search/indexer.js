'use strict';

let fs = require('fs');
let searcher = require('./searcher.js');
let csvParse = require('csv-parse');

const createIndex = () => {
  searcher.initIndex().then(searcher.initMapping).then(() => {
    console.log("Index mapping initialised")
    return readData()
  });
}

exports.createIndex = createIndex

const rebuildIndex = () => {
  searcher.indexExists().then((exists) => {
    if (exists) {
      console.log("Deleting old index")
      return searcher.deleteIndex()
    }
  }).then(() => {
    console.log("Creating new index")
    return createIndex();
  });
}

exports.rebuildIndex = rebuildIndex

const readData = () => {
  const parser = csvParse()
  const input = fs.createReadStream('data/bib_gourmand.csv')
  console.log("Reading data");

  const docs = []
  input.pipe(parser)
  .on('data', (data) => {
    console.log("Adding document", data)
    docs.push({
      title: data[0],
      content: data[1],
      suggest: {
        input: data[0],
        output: data[1]
      }
    })
  })

  const promise = new Promise((resolve,reject) => {
    input.on('end', () => {
      console.log("Finished reading data")
      searcher.addDocuments(docs).then(value => {
        console.log("Finished indexing")
        resolve(value)
      }, reason => {
        reject(reason)
      })
    })
  })

  return promise
}
