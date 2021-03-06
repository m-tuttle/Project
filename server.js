// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var logger = require("morgan");
var bodyParser = require('body-parser');
var request = require('request');
var path = require('path');

var PORT = process.env.PORT || 3001;
var app = express();


// Set the app up with morgan
app.use(logger("dev"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// Database configuration
var databaseUrl = process.env.MONGODB_URI || "mongodb://localhost/showflow";
var collections = ["flow", "users"];

// Hook mongojs config to db variable
var db = mongojs(databaseUrl , collections);

// Log any mongojs errors to console
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

  // Allow the api to be accessed by other apps

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
    next();
  });

  // Login routes to verify or create user

  app.get('/checkuser', function(req, res) {
    db.users.find(req.query, {password: 0}, function (err, result) {
      if (err) throw err;
      res.json(result);
    })
  })

  app.get('/getuser/:id', function(req, res) {
    db.users.find({_id: mongojs.ObjectId(req.params.id)}, {password: 0}, function(err, result) {
      if (err) throw err;
      res.json(result);
    })
  })

  app.get('/checkdup', function(req, res) {
    db.users.find({ $or: [{'name': req.query.name}, {'email': req.query.email}]}, function (err, result) {
      if (err) throw err;
      res.json(result);
    })
  })

  app.post('/createuser', function(req, res) {
    db.users.insert({'name': req.body.name, 'password': req.body.pass, 'email': req.body.email}, function (err, result) {
      if (err) throw err;
      res.json(result);
      db.flow.insert({'userId': result._id, 'name': result.name, 'date': new Date(), 'action': 'joined', 'target' : 'ShowFlow' }, function (err, result) {
        if (err) throw err;
      })
    })
  })

  // Routes to find and display feed information from user activity

  app.get('/usersbyshow', function (req, res) {
    db.users.find({ "shows.showtitle": req.query.title }, {password: 0}, function (err, result) {
      if (err) throw err;
      res.json(result);
    })
  })

  app.get('/flow', function(req, res) {
    db.flow.find({}).sort({'date': -1}, function(err, docs) {
      res.json(docs)
    })
  })

  app.get("/toptrending", function(req, res) {
    db.users.aggregate([ 
      {$unwind: "$shows"},
      {$group: { _id : "$shows.showtitle", number: {$sum: 1}}}, 
      {$sort: {number: -1}}, 
      {$limit:5}
    ],
      function(error, result) {
        res.json(result);
      }
    );
  });

  app.get("/showallusers", function(req, res) {
    db.users.find({}, {password: 0},
      function(error, result) {
        res.json(result);
      }
    );
  });

  // Update show watch status by user, updating account and flow

  app.post('/saveshow', function(req, res) {
    db.users.findAndModify({query: {_id: mongojs.ObjectId(req.body.userId)}, update : { $addToSet : { "shows" : { showid : req.body.saveId, showtitle : req.body.saveTitle, showimage : req.body.saveImage, showstatus: req.body.saveStatus}}} }, function(err, result) {
      if(result.shows !== undefined) {
          if(result.shows.filter(e => e.showid === req.body.saveId).length === 0) {
          db.flow.insert({'userId': req.body.userId, 'name': req.body.userName, 'date': new Date(), 'action': req.body.saveStatus, 'target' : req.body.saveTitle, 'showimg' : req.body.saveImage }, function (err, showresult) {
          res.json(showresult);
          })
          } 
      } else {
        db.flow.insert({'userId': req.body.userId, 'name': req.body.userName, 'date': new Date(), 'action': req.body.saveStatus, 'target' : req.body.saveTitle, 'showimg' : req.body.saveImage }, function (err, showresult) {
          if (err) throw err;
          res.json(showresult);
          })
      }

    })
  });

  app.post('/updateshow', function(req, res) {
    db.users.update({"_id": mongojs.ObjectID(req.body.userId), "shows.showid" : req.body.showId}, { $set : { "shows.$.showstatus" : req.body.updateStatus }} , function(err, result) {
      if (err) throw err;
      db.flow.insert({'userId': req.body.userId, 'name': req.body.userName, 'date': new Date(), 'action': 'updated the watch status of', 'target' : req.body.showTitle, 'showstatus': req.body.updateStatus, 'showimg' : req.body.showImage }, function (err, result) {
        if (err) throw err;
        res.json(result);
      })

    })
  });

  app.post('/deleteshow', function(req, res){
    console.log(req.body);
    db.users.update({'_id': mongojs.ObjectID(req.body.userId)}, { $pull : { 'shows' : { 'showid' : req.body.saveId }}
    }, function(error, removed) {
      if (error) {
        res.send(error);
      }else {
        res.json(removed);
      }
    });

 });

  // Show comment routes on show pages
  
  app.post('/savecomments', function(req, res){
    db.flow.insert({...req.body, date : new Date() }, function(err, result) {
    if (err) throw err;
    res.json(result)
    })
  })

  app.get('/comments/:show', function(req, res) {
    db.flow.find({'target' : req.params.show, 'action' : 'commented on'}).sort({date : -1}, function(err, docs) {
      res.json(docs)
    })
  });


// Default route
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, './client/build/index.html'));
});

// Listen on port 3001
  app.listen(PORT, function() {
    console.log('🌎 ==> Now listening on PORT %s! Visit http://localhost:%s in your browser!', PORT, PORT);
  });




