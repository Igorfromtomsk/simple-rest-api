const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const Task = require('./app/models/task');
const port = process.env.PORT || 8080;
const router = express.Router();

const db = mongoose.connection;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

mongoose.connect('mongodb://igorfromtomsk:passtome42@ds159782.mlab.com:59782/database_made_by_glass');

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("DB connection alive");
});

router.use(function (req, res, next) {
  console.log('Something is happening.');
  next();
});

router.route('/tasks')
  .get(function (req, res) {
    Task.find(function (err, bears) {
      if (err) res.send(err);
      res.json(bears);
    });
  });

router.route('/task/')
  .post(function (req, res) {
    const task = new Task();

    task.name = req.body.name;
    task.isCompleted = false;

    task.save(function (err) {
      if (err) res.send(err);
      res.json({message: 'Task created!'});
    });
  });

router.route('/task/:task_id')

  .get(function (req, res) {
    Task.findById(req.params.tasks_id, function (err, task) {
      if (err) res.send(err);
      res.json(task);
    });
  })

  .put(function (req, res) {
    Task.findById(req.params.tasks_id, function (err, task) {
      if (err) res.send(err);

      task.name = req.body.name;
      task.save(function (err) {
        if (err) res.send(err);
        res.json({message: 'Task updated!'});
      });
    });
  })

  .delete(function (req, res) {
    Task.remove({
      _id: req.params.task_id
    }, function (err, task) {
      if (err) res.send(err);

      res.json({message: 'Successfully deleted'});
    });
  });


app.use('/api', router);
app.listen(port);
console.log('Magic happens on port ' + port);
