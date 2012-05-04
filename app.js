// constants

const express   = require("express")
    , connect   = require("connect")
    , fs        = require("fs")
    , Sequelize = require("sequelize")
    , moment    = require("moment")
    , Tracker   = require("./src/pivotal-tracker.js")
    , stylus    = require("stylus")
    , config    = JSON.parse(fs.readFileSync("./config/config.json"))

// variables

var sequelize = new Sequelize(config.dbName, config.dbUsername, config.dbPassword, {
      logging: false,
      dialect: 'sqlite',
      storage: 'database.sqlite'
    })
  , tracker   = new Tracker(sequelize, config.token, {
      projectId: config.projectId
    })
  , app       = module.exports = express.createServer()
  , Activity  = sequelize.import(__dirname + '/models/activity')

// extensions

require("./src/extensions/string")

// configuration

app.configure(function(){
  app.set('views', __dirname + '/views')
  app.set('view engine', 'jade')
  app.use(stylus.middleware({
    src: __dirname + '/stylesheets',
    dest: __dirname + '/public'
  }))
  app.use(connect.logger({ immediate: true, format: ":date :method | :status | :url (via :referrer)" }))
  app.use(express.bodyParser())
  app.use(express.methodOverride())
  app.use(app.router)
  app.use(express.static(__dirname + '/public'))
  app.helpers(require("./src/view-helpers"))
  sequelize.sync().success(function() {
    tracker.scheduleUpdate()
  })
})

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))
})

app.configure('production', function(){
  app.use(express.errorHandler())
})

// routes

app.get('/', function(req, res) {
  Activity.count().success(function(cnt) {
    console.log(cnt)
    res.render('index', {
      title: 'Pivotal TimeTravel',
      config: config,
      activityCount: cnt,
      boardLayouts: ['user', 'state'],
      boardLayout: req.param('layout') || 'user'
    })
  })
})

app.post('/activities', function(req, res) {
  var username = req.param('username')

  if(config.usernames.indexOf(username) > -1) {
    Activity.findAll({
      where: [
        "ownedBy = ? and updatedAt > ?",
        username.trim(),
        moment().subtract('days', req.param('range') || 2).sod().toDate()
      ]
    }).success(function(activities) {
      res.render('activity-layouts/' + (req.param('layout') || 'user'), {
        username: username,
        activities: activities,
        layout: false
      })
    }).error(function(err) {
      res.send(err)
    })
  } else {
    console.log('no user found with name: ' + username)
    res.send('-')
  }
})

// bind app to port

app.listen(3000)
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env)
