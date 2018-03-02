const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose  = require('mongoose');
const cluster = require('cluster');
const request = require('request');
const numCPUs = require('os').cpus().length;

const PORT = process.env.PORT || 5000;

// Multi-process to utilize all CPU cores.
if (cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} else {
  const app = express();
  mongoose.Promise = require('bluebird');
  var Feature = require('./models/Feature');
  const router = express.Router();

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));
  app.use(bodyParser.urlencoded({ extended : true }));
  app.use(bodyParser.json());
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  const db = process.env.MONGODB_URI || 'mongodb://localhost/bears';

  // connect to database
  mongoose.connection.openUri(db);

  // Answer API requests.
  app.get('/api', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send('{"message":"Hello from the custom server!"}');
  });

  router.use(function(res, req, next) {
    console.log("something is happening");
    next();
  })

  router.get('/', function(req, res) {
    res.json({ message: "Hello, welcome to our api!"})
  })

  router.route('/features')
    .post(function(req, res){
      var feature = new Feature();
      feature.index = 1;
      feature.name = "COD";
      feature.full_name = "Codin\'";
      feature.desc = ["Thas how good you are at codin\'"],
      feature.skills = [{
        "url": "https://git.heroku.com/shrouded-stream-28894/api/skills/123",
        "name": "Typin\'"
      }];
      feature.url = "https://git.heroku.com/shrouded-stream-28894/api/ability-scores/123";

      feature.save(function(err) {
        if(err) {
          res.send(err);
        } else {
          res.json({ message: "feature created" });
        }
      });
    })
    .get(function(req, res){
      Feature.find(function(err, bears){
        if(err) {
          res.send(err);
        } else {
          res.json(bears);
        }
      });
    });

  router.route('/features/:index')
    .get(function(req, res){
      Feature.findBy({"index": req.params.index},  function(err, bears){
        if(err) {
          res.send(err);
        } else {
          res.json(bears);
        }
      });
    });

  app.use('/api', router);

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });

  app.listen(PORT, function () {
    console.error(`Node cluster worker ${process.pid}: listening on port ${PORT}`);
  });
}
