module.exports = {
  labelForStoryType: function(activity) {
    var klass = {
      feature: 'success',
      chore: 'warning',
      bug: 'important'
    }[activity.storyType]

    return "<span class='label story-type label-" + klass + "'>" + activity.storyType + "</span>"
  },

  labelForStoryStatus: function(activity) {
    var klass = {
      unstarted: '',
      accepted: 'success',
      started: 'info',
      finished: 'info',
      rejected: 'important',
      delivered: 'warning'
    }[activity.status]

    return "<span class='label story-status label-" + klass + "'>" + activity.status + "</span>"
  }
}
