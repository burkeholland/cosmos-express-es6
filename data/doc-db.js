let DocumentClient = require('documentdb').DocumentClient;
let dbUtils = require('./doc-db-utils');

function Task(host, authKey, databaseId, collectionId) {

    this.databaseId = databaseId;
    this.collectionId = collectionId;

    this.client = new DocumentClient(host, {
        masterKey: authKey
    });

    this.init = () => {
        let self = this;
        
        return new Promise((resolve, reject) => {
            dbUtils.getOrCreateDatabase(self.client, self.databaseId)
            .then(db => {
                dbUtils.getOrCreateCollection(self.client, db._self, self.collectionId)
                .then(coll => {
                    self.collection = coll;
                    resolve();
                })
                .catch(err => {
                    reject(err);
                })
            })
            .catch(err => {
                reject(err);
            })
        });
    }

    this.find = (querySpec) => {
        let self = this;

        return new Promise((resolve, reject) => {
            self.client.queryDocuments(self.collection._self, querySpec)
                .toArray((err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                })
        });
    }

    this.addItem = (item) => {
        let self = this;

        item.date = Date.now();
        item.completed = false;

        return new Promise((resolve, reject) => {
            self.client.createDocument(self.collection._self, item, (err, doc) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(doc);
                }
            });
        });   
    }

    this.updateItem = (itemId) => {
        let self = this;

        return new Promise((resolve, reject) => {
            self.getItem(itemId, (err, doc) => {
                if (err) {
                    reject(err);
                }
                else {
                    doc.completed = true;

                    self.client.replaceDocument(doc._self, doc, (err, replaced) => {
                        if (err) {
                            reject(err);
                        } 
                        else {
                            resolve(replaced);
                        }
                    });
                }
            });
        });
    }

    this.getItem = (itemId) => {
        var querySpec = {
            query: 'SELECT * FROM root r WHERE r.id = @id',
            parameters: [{
                name: '@id',
                value: itemId
            }]
        };

        return new Promise((resolve, reject) => {
            this.client.queryDocuments(this.collection._self, querySpec)
                .toArray((err, results) => {    
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(results[0]);
                    }
                });
        });
    }
}

module.exports = Task;