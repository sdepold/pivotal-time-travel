Application = {
  Index: {
    init: function() {
      this.loadStories()
      this.Slider.observe()
    },

    Slider: {
      getElement: function() {
        return $('#dateRangeSlider input')
      },

      observe: function() {
        var self = this

        this.getElement().change(function() {
          self.printValue()
          Application.Index.loadStories()
        })
      },

      printValue: function() {
        $("#dateRangeSlider span").text(this.getValue())
      },

      getValue: function() {
        return this.getElement().val()
      }
    },

    loadStories: function() {
      var self = this

      $('.activities').each(function() {
        var $element = $(this)

        $element.load('/activities', {
          username: $element.data('username'),
          range: self.Slider.getValue()
        })
      })
    }
  }
}
