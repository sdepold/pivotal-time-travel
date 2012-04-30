Application = {
  Index: {
    LayoutChooser: {
      init: function() {
        var $select = $('#layoutChooser select')
          , self    = this

        $select.change(function() {
          location.href = '/?layout=' + self.getLayout()
        })
      },

      getLayout: function() {
        return $('#layoutChooser select').val()
      }
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
        return this.getElement().slider('value')
      },

      setValue: function() {
        $('#dataRangeSliderValue span').text(this.getValue() + " day(s)")
      },

      getElement: function() {
        return $('#dataRangeSlider')
      }
    },

    init: function() {
      this.Slider.init()
      this.LayoutChooser.init()
      this.loadStories()
    },

    loadStories: function() {
      var self = this

      switch(Application.Index.LayoutChooser.getLayout()) {
        case 'user':
          self.loadStoriesForUserLayout()
          break;
        case 'state':
          self.loadStoriesForStateLayout()
          break;
        default:
          throw new Error('Unknown layout choosen.')
          break;
      }
    },

    loadStoriesForUserLayout: function() {
      var self = this

      $('.activities').each(function() {
        var $element = $(this)

        $element.load('/activities', {
          username: $element.data('username'),
          range: self.Slider.getValue()
        })
      })
    },

    loadStoriesForStateLayout: function() {
      var self = this

      $('.states-of-user').each(function() {
        var $row = $(this)

        $row.load('/activities', {
          layout: 'state',
          username: $row.data('username'),
          range: self.Slider.getValue()
        })
      })
    }
  }
}
