PivotalTimeTravel.SprintStart = (function() {
  "use strict"

  var SprintStart = function(selector) {
    this.selector = selector
    this.element  = $(selector)

    init.call(this)
  }

  SprintStart.prototype.getElement = function() {
    return this.element
  }

  SprintStart.prototype.getValue = function() {
    return this.getElement().val()
  }

  /////////////
  // private //
  /////////////

  var init = function() {
    var self = this

    permanentize.call(this)

    this.getElement().datepicker().change(function() {
      $(self).trigger('change')
    })
  }

  var permanentize = function() {
    var self = this

    this
      .getElement()
      .val($.cookie('sprint-start'))
      .change(function() {
        $.cookie('sprint-start', self.getValue())
      })
  }


  return SprintStart
})()
