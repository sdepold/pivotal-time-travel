Application = {
  Index: {
    init: function() {
      this.Slider.init()
      this.loadStories()
    },

    Slider: {
      init: function() {
        var self = this

        this.getElement().slider({
          min: 1,
          max: 20,
          value: 1,
          slide: function( event, ui ) {
            self.setValue()
            Application.Index.loadStories()
          }
        })

        this.setValue()
      },

      getValue: function() {
        console.log(this.getElement().slider('value'))
        return this.getElement().slider('value')
      },

      setValue: function() {
        $('#dataRangeSliderValue span').text(this.getValue() + " day(s)")
      },

      getElement: function() {
        return $('#dataRangeSlider')
      }
    },

    loadStories: function() {
      var self   = this

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
