Layout.ScrumBoard = (function() {
  "use strict"

  var scrumStates = {
    'Unstarted': 'Unstarted',
    'Started':   'Started',
    'Finished':  'Finished',
    'Delivered': 'Delivered',
    'Rejected':  'Rejected',
    'Accepted':  'Accepted'
  }

  var ScrumBoard = function(selector) {
    this.element = $(selector)
    this.table   = $('<table class="well" cellpadding="0" cellspacing="0" border="0">').appendTo(this.element)
  }

  ScrumBoard.prototype.render = function() {
    var self = this
    getActivities.call(this, function(data) {
      for(var username in data) {
        if(username !== "null") {
          renderUserRow.call(self, username, data[username])
        }
      }

      renderUserRow.call(self, 'Unassigned', data['null'])
    })

    renderHeadlines.call(this)
  }

  /////////////
  // private //
  /////////////

  var getActivities = function(callback) {
    $.getJSON('/activities', {
      sprintStart: Application.Index.SprintStart.getValue()
    }).success(function(data) {
      callback && callback(data)
    }).error(function(err) {
      console.log(err)
    })
  }

  var renderHeadlines = function() {
    var tr = $('<tr>').appendTo(this.table)

    tr.append($('<th>'))

    for(var state in scrumStates) {
      tr.append($('<th>').text(scrumStates[state]))
    }
  }

  var renderUserRow = function(username, activities) {
    var tr = $('<tr>').appendTo(this.table)

    tr.append($('<td>').text(username))

    for(var state in scrumStates) {
      tr.append($('<td>').attr('data-state', state.toLowerCase()))
    }

    activities.forEach(function(activity) {
      var story = $('<div class="activity ' + activity.storyType + '">')
        .html(activity.updatedAt + '<br/>' + activity.title)
        .appendTo($('[data-state=' + activity.status.toLowerCase() + ']', tr))

      var storyType = $('<div class="label story-type">').text(activity.storyType)
      var storyLabels = $('<div class="labels">')

      if(activity.labels !== null) {
        activity.labels.split(',').forEach(function(label) {
          storyLabels.append($('<span class="label">').text(label))
        })
      }

      story.append(storyType).append(storyLabels)
    })
  }

  return ScrumBoard
})()
