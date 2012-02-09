var pivotal   = require("pivotal")
  , moment    = require("moment")
  , yesterday = moment().subtract('days', 1).sod().toDate()
  , token     = process.env.TOKEN
  , username  = process.env.USERNAME
  , projectId = process.env.PROJECTID
  , offset    = process.env.OFFSET || 1500

if(!token || !username || !projectId)
  throw new Error('Run app like this: PROJECTID=id TOKEN=asd USERNAME=foobar node app.js')

var storyTimestampToDate = function(d) {
  return moment(d, 'YYYY/MM/DD HH:mm:ss CET').toDate()
}

pivotal.useToken(token)

pivotal.getStories(projectId, {
  filter: 'includedone:true',
  offset: offset
}, function(err, data) {
  if(err) return console.log(err.errors.error[0])

  stories = data.story.filter(function(story) {
    var isOwnedByMe   = (story.owned_by == username)
      , isInDateRange = (storyTimestampToDate(story.updated_at) > yesterday)

    return isOwnedByMe && isInDateRange
  })

  stories = stories.sort(function(a, b) {
    return storyTimestampToDate(a.updated_at) - storyTimestampToDate(b.updated_at)
  })

  stories.forEach(function(story) {
    var template = "[{{date}}] [{{type}}] {{status}}: {{name}}"
      , message  = template
          .replace('{{date}}', story.updated_at)
          .replace('{{type}}', story.story_type.toUpperCase())
          .replace('{{status}}', story.current_state.toUpperCase())
          .replace('{{name}}', story.name)

    console.log(message)
  })
})
