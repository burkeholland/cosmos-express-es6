exports.getOrCreateDatabase = (client, databaseId) => {
    let querySpec = {
        query: 'SELECT * FROM root r WHERE r.id= @id',
        parameters: [{
            name: '@id',
            value: databaseId
        }]
    };
    
    return new Promise((resolve, reject) => {
        client.queryDatabases(querySpec)
            .toArray((err, results) => {
                if (err) {
                    reject(err);
                }
                else {
                    if (results.length === 0) {
                        let databaseSpec = { id: databaseId };

                        client.createDatabase(databaseSpec, (err, created) => {
                            resolve(created);
                        });
                    }
                    else {
                        resolve(results[0]);
                    }
                }
            });
    });
}

exports.getOrCreateCollection = (client, databaseLink, collectionId, callback) => {
    var querySpec = {
        query: 'SELECT * FROM root r WHERE r.id=@id',
        parameters: [{
            name: '@id',
            value: collectionId
        }]
    };               

    return new Promise((resolve, reject) => {
        client.queryCollections(databaseLink, querySpec).toArray(function (err, results) {
            if (err) {
                reject(err);
            }
            else {        
                if (results.length === 0) {
                    let collectionSpec = {
                        id: collectionId
                    };

                    client.createCollection(databaseLink, collectionSpec, (err, created) => {
                        resolve(created);
                    });

                } else {
                    resolve(results[0]);
                }
            }
        });
    });
}