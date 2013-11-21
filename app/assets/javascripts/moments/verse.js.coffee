window.Moments ?= {}

class window.Moments.Verse
  constructor: (@params)->
    @el         = @params.el
    @usfm       = @el.data("usfm")
    @version_id = @el.data("version-id")
    @el.html("Loading")
    this.fetch()

  fetch: ->
    verse_url = "/bible/" + @version_id + "/" + @usfm + ".json"
    
    request = $.ajax verse_url,
      type: "GET"
      dataType: "json"

    request.done (data) =>
      @el.html(data.content_plain)
      @el.removeClass("empty").addClass("loaded")
      $('.social-feed').trigger('refreshWookmark')
      return

    request.fail (jqXHR,status) =>
      alert "Failed verse request" + status
