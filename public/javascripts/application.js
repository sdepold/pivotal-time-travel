Application = {
  Index: {
    init: function() {
      this.loadStories()
      this.observeSlider()
    },

    observeSlider: function() {
      console.log('blabla')
      $('#dateRangeSlider').change(function() {
        console.log(this.value)
      })
    },

    loadStories: function() {
      $('.activities').each(function() {
        var $element = $(this)
        $element.load('/activities', {
          username: $element.data('username')
        })
      })
    }
  }
}
