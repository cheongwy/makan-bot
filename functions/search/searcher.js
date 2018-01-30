const elasticsearch = require('elasticsearch');

const bonsai_url = process.env.BONSAI_URL;

const elasticClient = new elasticsearch.Client({
    host: bonsai_url,
    log: 'info'
});

const indexName = "food_index";

/**
* Delete an existing index
*/
const deleteIndex = () => {
    return elasticClient.indices.delete({
        index: indexName
    });
}
exports.deleteIndex = deleteIndex;

/**
* create the index
*/
const initIndex = () => {
    return elasticClient.indices.create({
        index: indexName
    });
}
exports.initIndex = initIndex;

/**
* check if the index exists
*/
const indexExists = () => {
    return elasticClient.indices.exists({
        index: indexName
    });
}
exports.indexExists = indexExists;

const initMapping = () => {
    return elasticClient.indices.putMapping({
        index: indexName,
        type: "document",
        body: {
            properties: {
                title: { type: "string" },
                content: { type: "string" }
            }
        }
    });
}
exports.initMapping = initMapping;

const addDocument = (document) => {
    return elasticClient.index({
        index: indexName,
        type: "document",
        body: {
            title: document.title,
            content: document.content
        }
    });
}
exports.addDocument = addDocument;

const addDocuments = (documents) => {
    var docs = documents.map(function(doc){
      return [{ index: {
          _index: indexName,
          _type: "document"
        }
      }, doc ]
    })
    var idocs = [].concat.apply([], docs);
    return elasticClient.bulk({ body: idocs })
}
exports.addDocuments = addDocuments;

const getSuggestions = (input) => {
    return elasticClient.search({
        index: indexName,
        type: "document",
        q: input,
        timeout: '5s'
    })
}
exports.getSuggestions = getSuggestions;
