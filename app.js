var pivotal   = require("pivotal")
  , moment    = require("moment")
  , yesterday = moment().subtract('days', 1).sod().toDate()
  , token     = process.env.TOKEN
  , usernames = process.env.USERNAME.split(',').map(function(username) { return username.trim() })
  , projectId = process.env.PROJECTID
  , offset    = process.env.OFFSET || 1500

if(!token || (usernames.length == 0) || !projectId)
  throw new Error('Run app like this: PROJECTID=id TOKEN=asd USERNAME=foobar node app.js')

var storyTimestampToDate = function(d) {
  return moment(d, 'YYYY/MM/DD HH:mm:ss CET').toDate()
}

pivotal.useToken(token)

pivotal.getStories(projectId, {
  filter: 'includedone:true',
  offset: offset
}, function(err, data) {
  if(err)
    return console.log(err.errors.error[0])

  var storiesByOwner = {}

  data.story.forEach(function(story) {
    var isInDateRange     = (storyTimestampToDate(story.updated_at) > yesterday)
      , isOwnerByRelevant = (usernames.indexOf(story.owned_by) != -1)

    if(isInDateRange && isOwnerByRelevant) {
      storiesByOwner[story.owned_by] = storiesByOwner[story.owned_by] || []
      storiesByOwner[story.owned_by].push(story)
    }
  })

  for(var owner in storiesByOwner) {
    var stories = storiesByOwner[owner].sort(function(a, b) {
      return storyTimestampToDate(a.updated_at) - storyTimestampToDate(b.updated_at)
    })

    console.log('\nStories for ' + owner)
    console.log('==============================')

    stories.forEach(function(story) {
      var template = "[{{date}}] [{{type}}] {{status}}: {{name}}"
        , message  = template
            .replace('{{date}}', story.updated_at)
            .replace('{{type}}', story.story_type.toUpperCase())
            .replace('{{status}}', story.current_state.toUpperCase())
            .replace('{{name}}', story.name)

      console.log(message)
    })
  }
})
