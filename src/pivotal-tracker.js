const pivotal = require("pivotal")
    , util    = require("util")
    , _       = require("underscore")
    , moment  = require("moment")

var PivotalTracker = module.exports = function(sequelize, token, options) {
  this.sequelize        = sequelize
  this.token            = token
  this.offset           = 0
  this.currentlySyncing = false
  this.options          = _.extend({
    itemsPerIteration: 500,
    projectId:         null
  }, options || {})

  pivotal.useToken(this.token)
}

PivotalTracker.prototype.syncDatabaseWithPivotal = function() {
  var self = this

  if(self.currentlySyncing) {
    console.log('Synchronization skipped because there is already one running')
  } else {
    console.log('Synchronizing database with pivotal')

    var iteratePivotalCallback = function(err, data) {
      createActivityEntriesFromApiData.call(self, err, data)

      if(data && data.story && data.story.length > 0) {
        self.offset += data.story.length
        iteratePivotal.call(self, iteratePivotalCallback)
      } else {
        self.currentlySyncing = false
        console.log('\nFinished synchronization.')
      }
    }

    self.currentlySyncing = true
    iteratePivotal.call(self, iteratePivotalCallback)
  }
}

PivotalTracker.prototype.scheduleUpdate = function(options) {
  var self = this

  options = _.extend({
    delay: 1000 * 60 * 5 // 5 minutes
  }, options || {})

  this.updateIntervalId = setInterval(function() {
    self.syncDatabaseWithPivotal()
  }, options.delay)

  this.syncDatabaseWithPivotal()
  console.log('Tracker will update the database every ' + (options.delay / 1000) + "s.")
}

/////////////
// private //
/////////////

var iteratePivotal = function(callback) {
  pivotal.getStories(this.options.projectId, {
    filter: 'includedone:true',
    offset: this.offset,
    limit:  this.options.itemsPerIteration
  }, callback)
}

var createActivityEntriesFromApiData = function(err, data) {
  var Activity = this.sequelize.daoFactoryManager.getDAO('Activity')

  if(err && err.errors)
    return console.log(err.errors.error[0])

  if(!data || !data.story || !Array.isArray(data.story) || ( data.story.length == 0))
    return

  data.story.forEach(function(story) {
    util.print('.')

    Activity.find(parseInt(story.id)).success(function(activity) {
      var updatedAt = moment(story.updated_at, 'YYYY/MM/DD HH:mm:ss z').toDate()
        , createdAt = moment(story.created_at, 'YYYY/MM/DD HH:mm:ss z').toDate()
        , options   = {
            storyType:   story.story_type,
            title:       story.name,
            status:      story.current_state,
            ownedBy:     story.owned_by,
            requestedBy: story.requested_by,
            labels:      story.labels,
            updatedAt:   updatedAt,
            createdAt:   createdAt
          }

      if(story.current_state.toLowerCase() == 'started') {
        options.startedAt = updatedAt
      }

      if(activity) {
        activity.updateAttributes(options)
      } else {
        if(story.current_state.toLowerCase() != 'started') {
          options.startedAt = null
        }

        options.id = story.id
        Activity.create(options)
      }
    })
  })
}
