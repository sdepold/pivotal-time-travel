const pivotal = require("pivotal")
    , _       = require("underscore")

var PivotalTracker = module.exports = function(sequelize, token, options) {
  this.sequelize = sequelize
  this.token     = token
  this.offset    = 0
  this.options   = _.extend(options || {}, {
    itemsPerIteration: 100
  })

  pivotal.useToken(this.token)
}

PivotalTracker.prototype.fillDatabase = function(projectId) {
  var self                   = this
    , iteratePivotalCallback = function(err, data) {
        createActivityEntriesFromApiData.call(self, err, data)

        if(data && data.story && data.story.length > 0) {
          self.offset += data.story.length
          iteratePivotal.call(self, projectId, iteratePivotalCallback)
        }
      }

  iteratePivotal.call(this, projectId, iteratePivotalCallback)
}

/////////////
// private //
/////////////

var iteratePivotal = function(projectId, callback) {
  pivotal.getStories(projectId, {
    filter: 'includedone:true',
    offset: this.offset,
    limit:  this.options.itemsPerIteration
  }, callback)
}

var createActivityEntriesFromApiData = function(err, data) {
  var Activity = this.sequelize.daoFactoryManager.getDAO('Activity')

  if(err && err.errors)
    return console.log(err.errors.error[0])

  if(!data || !data.story ||( data.story.length == 0))
    return

  data.story.forEach(function(story) {
    Activity.find(parseInt(story.id)).success(function(activity) {
      if(!activity) {
        Activity.create({
          storyType:   story.story_type,
          title:       story.name,
          status:      story.current_state,
          id:          story.id,
          ownedBy:     story.owned_by,
          requestedBy: story.requested_by,
          updatedAt:   story.updated_at,
          createdAt:   story.created_at
        })
      }
    })
  })
}




  // var onDataCallback = function(err, data) {
  //   if(err && err.errors)
  //     return console.log(err.errors.error[0])

  //   data.story.forEach(function(story) {
  //     A

  //     if(isInDateRange && isOwnerByRelevant) {
  //       storiesByOwner[story.owned_by] = storiesByOwner[story.owned_by] || []
  //       storiesByOwner[story.owned_by].push(story)
  //     }
  //   })

  //   for(var owner in storiesByOwner) {
  //     var stories = storiesByOwner[owner].sort(function(a, b) {
  //       return storyTimestampToDate(a.updated_at) - storyTimestampToDate(b.updated_at)
  //     })

  //     console.log('\nStories for ' + owner)
  //     console.log('==============================')

  //     stories.forEach(function(story) {
  //       var template = "[{{date}}] [{{type}}] {{status}}: {{name}}"
  //         , message  = template
  //             .replace('{{date}}', story.updated_at)
  //             .replace('{{type}}', story.story_type.toUpperCase())
  //             .replace('{{status}}', story.current_state.toUpperCase())
  //             .replace('{{name}}', story.name)

  //       console.log(message)
  //     })
  //   }
  // }

