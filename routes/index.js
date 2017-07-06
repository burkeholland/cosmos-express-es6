var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  const task = req.app.locals.task;

  var querySpec = {
      query: 'SELECT * FROM root r WHERE r.completed=@completed',
      parameters: [{
          name: '@completed',
          value: false
      }]
  };

  task.find(querySpec).then((results) => {
    res.render('index', { title: 'Express', tasks: results });
  });

});

router.post('/tasks/create', function(req, res) {
    const item = req.body;
    const task = req.app.locals.task;

    task.addItem(item).then((err) => {
        if (err) {
            throw (err);
        }
        res.redirect('/');
    });
});

// router.post('/', function(req, res) {
//   'posting!'

//   res.redirect('/');
// });

module.exports = router;
