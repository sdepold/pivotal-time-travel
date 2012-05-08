Application = {
  Index: {
    init: function() {
      this.Slider.permanentize()
      this.LayoutChooser.permanentize()
      this.SprintStart.permanentize()

      this.Slider.init()
      this.LayoutChooser.init()
      this.SprintStart.init()

      this.loadStories()
    },

    loadStories: function() {
      var self = this

      switch(Application.Index.LayoutChooser.getValue()) {
        case 'user':
          self.loadStoriesForUserLayout()
          break
        case 'state':
          self.loadStoriesForStateLayout()
          break
        default:
          throw new Error('Unknown layout choosen.')
          break
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
          sprintStart: Application.Index.SprintStart.getValue()
        })
      })
    },

    LayoutChooser: {
      init: function() {
        var self = this

        this.getElement().change(function() {
          location.href = '/?layout=' + self.getValue()
        })
      },

      getElement: function() {
        return $('#layoutChooser select')
      },

      getValue: function() {
        return this.getElement().val()
      },

      permanentize: function() {
        var $layoutSelector = this.getElement()
          , self            = this

        if($.cookie('layout') && (document.location.href.indexOf('layout=' + $.cookie('layout')) == -1)) {
          document.location.href = "/?layout=" + $.cookie('layout')
        } else {
          $layoutSelector.val($.cookie('layout'))
        }

        $layoutSelector.change(function() {
          $.cookie('layout', self.getValue())
        })
      }
    },

    Slider: {
      init: function() {
        var self = this

        this.getElement().slider({
          min: 1,
          max: 20,
          value: parseInt($.cookie('slider') || 1),
          slide: function( event, ui ) {
            self.setValue()
            Application.Index.loadStories()
            self.changeListener.forEach(function(fct) {
              fct(self.getValue())
            })
          }
        })

        this.setValue()
      },

      changeListener: [],

      getValue: function() {
        return this.getElement().slider('value')
      },

      setValue: function() {
        $('#dataRangeSliderValue span').text(this.getValue() + " day(s)")
      },

      getElement: function() {
        return $('#dataRangeSlider')
      },

      permanentize: function() {
        this.changeListener.push(function(value) {
          $.cookie('slider', value)
        })
      }
    },

    SprintStart: {
      init: function() {
        this.getElement().datepicker().change(function() {
          Application.Index.loadStories()
        })
      },

      getElement: function() {
        return $('#sprintStartContainer input')
      },

      getValue: function() {
        return this.getElement().val()
      },

      permanentize: function() {
        var self = this

        this.getElement().val($.cookie('sprint-start'))

        this.getElement().change(function() {
          $.cookie('sprint-start', self.getValue())
        })
      }
    }
  }
}
