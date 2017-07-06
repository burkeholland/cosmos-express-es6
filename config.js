 var config = {}

 config.host = process.env.HOST || "https://burke-comosdb-docs.documents.azure.com:443/";
 config.authKey = process.env.AUTH_KEY || "47e5nV1v93vR4eh5cTgbW2COjVcRndIyO49QJUYy0AjsNyfgOR2Q7tk8VY6OITlYhiv3EPB8WCxGUjVIRdXrwQ==";
 config.databaseId = "ToDoList";
 config.collectionId = "Items";

 module.exports = config;