PivotalTimeTravel.Layout.ScrumBoard = (function() {
  "use strict"

  var scrumStates = {
    'Unstarted': 'Unstarted',
    'Started':   'Started',
    'Finished':  'Finished',
    'Delivered': 'Delivered',
    'Rejected':  'Rejected',
    'Accepted':  'Accepted'
  }

  var ScrumBoard = function(selector, sprintStart) {
    var self = this

    this.element     = $(selector)
    this.table       = $('<table class="well" cellpadding="0" cellspacing="0" border="0">').appendTo(this.element)
    this.sprintStart = sprintStart

    $(this.sprintStart).on('change', function() {
      console.log('changed')
      self.render()
    })
  }

  ScrumBoard.prototype.render = function() {
    var self = this

    getActivities.call(this, function(data) {
      var usernames = []

      clearTable.call(self)
      renderHeadlines.call(self)

      for(var username in data) {
        usernames.push(username)
      }

      usernames.sort().forEach(function(username) {
        if(username !== "null") {
          renderUserRow.call(self, username, data[username])
        }
      })

      renderUserRow.call(self, 'Unassigned', data['null'])
      shrinkUserRows.call(self)
    })
  }

  /////////////
  // private //
  /////////////

  var getActivities = function(callback) {
    $.getJSON('/activities', {
      sprintStart: this.sprintStart.getValue()
    }).success(function(data) {
      callback && callback(data)
    }).error(function(err) {
      console.log(err)
    })
  }

  var clearTable = function() {
    this.table.empty()
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

    (activities || []).forEach(function(activity) {
      var startedAtInt       = (moment(activity.startedAt).unix() * 1000)
        , formattedStartedAt = moment(activity.startedAt).format('YYYY-MM-DD')
        , formattedUpdatedAt = moment(activity.updatedAt).format('YYYY-MM-DD')
        , storyRuntime       = (moment(activity.updatedAt).unix() * 1000) - startedAtInt
        , formattedStoryRuntime = ((startedAtInt === 0) || (storyRuntime < (1000 * 60 * 60 * 24)))
            ? ''
            : (' ∆' + moment(storyRuntime).format('DD'))
        , formattedTitle     = ('<strong>' + activity.title + '</strong>')
        , storyContent       = [formattedTitle, '<br/>', formattedUpdatedAt, formattedStoryRuntime].join('')
        , storyType          = $('<div class="label story-type">').text(activity.storyType)
        , storyLabels        = $('<div class="labels">')

console.log(moment(moment(activity.updatedAt).unix() * 1000), moment(startedAtInt), (moment(activity.updatedAt).unix() * 1000) - startedAtInt)

      if(activity.labels !== null) {
        activity.labels.split(',').forEach(function(label) {
          storyLabels.append($('<span class="label">').text(label))
        })
      }

      $('<div class="activity ' + activity.storyType + '">')
        .html(storyContent)
        .append(storyType)
        .append(storyLabels)
        .appendTo($('[data-state=' + activity.status.toLowerCase() + ']', tr))
    })
  }

  var shrinkUserRows = function() {
    var self = this

    $('tr', this.table).each(function() {
      shrinkUserRow.call(self, $(this))
    })
  }

  var shrinkUserRow = function($row) {
    var self = this

    $('td', $row).each(function() {
      shrinkUserColumn.call(self, $(this))
    })
  }

  var shrinkUserColumn = function($td) {
    var self        = this
      , $activities = $('.activity', $td)

    $('> a', $td).remove()

    if($activities.length > 3) {
      $activities.each(function(index) {
        if(index > 2) {
          $(this).hide()
        }
      })

      var collapseLink = $('<a>')

      collapseLink
        .text('Show ' + ($activities.length - 3) + ' further stories.')
        .attr('href', '#')
        .click(function() {
          expandUserColumn.call(self, $td)
          return false
        })

      $td.append(collapseLink)
    }
  }

  var expandUserColumn = function($td) {
    var self        = this
      , $activities = $('.activity', $td)

    $activities.each(function() {
      $(this).show()
    })

    $('> a', $td).remove()
    var shrinkLink = $('<a>')

    shrinkLink
      .text('Shrink stories to length of 3.')
      .attr('href', '#')
      .click(function() {
        shrinkUserColumn.call(self, $td)
        return false
      })

    $td.append(shrinkLink)
  }

  return ScrumBoard
})()
