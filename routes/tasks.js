const async = require('async');

const tasks = {
    list(req, res){

        const taskService = req.app.locals.taskService;

        const querySpec = {
            query: 'SELECT * FROM root r WHERE r.completed=@completed',
            parameters: [{
                name: '@completed',
                value: false
            }]
        };

        taskService.find(querySpec)
        .then((items) => {
            res.render('index', {
                title: 'My ToDo List ',
                tasks: items
            });
        })
        .catch((err) => {
            throw err;
        });
    },

    create(req, res) {
        let taskService = req.app.locals.taskService;
        let item = req.body;

        taskService.addItem(item)
        .then(() => {
            res.redirect('/');
        })
        .catch((err) => {
            throw err;
        });
    },

    complete(req, res) {
        const completedTasks = Object.keys(req.body);
        const taskService = req.app.locals.taskService;
        
        async.forEach(completedTasks, (completedTask, callback) => {
            taskService.updateItem(completedTask)
            .then(() => {
                callback(null);
            })
            .catch((err) => {
                callback(err);
            });
        }, (err) => {
            if (err) {
                throw err;
            } 
            else {
                res.redirect('/');    
            }
        });
    }
}

module.exports = tasks;