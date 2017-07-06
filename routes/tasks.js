var async = require('async');

const tasks = {
    list(req, res){

        let docDB = req.app.locals.docDB;

        var querySpec = {
            query: 'SELECT * FROM root r WHERE r.completed=@completed',
            parameters: [{
                name: '@completed',
                value: false
            }]
        };

        docDB.find(querySpec)
        .then((items) => {
            res.render('index', {
                title: 'My ToDo List ',
                tasks: items
            });
        })
        .catch((err) => {
            console.log(err);
        });
    },

    create(req, res) {
        let docDB = req.app.locals.docDB;
        let item = req.body;

        docDB.addItem(item)
        .then(() => {
            res.redirect('/');
        })
        .catch((err) => {
            console.log(err);
        });
    },

    complete(req, res) {
        let completedTasks = Object.keys(req.body);
        let docDB = req.app.locals.docDB;

        async.forEach(completedTasks, (completedTask, callback) => {
            docDB.updateItem(completedTask)
            .then(() => {
                callback(null);
            })
            .catch((err) => {
                callback(err);
            });
        });
    }
}

module.exports = tasks;