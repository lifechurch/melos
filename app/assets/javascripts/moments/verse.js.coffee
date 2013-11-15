window.Moments ?= {}

class window.Moments.Verse
  constructor: (@params)->
    @el         = @params.el
    @usfm       = @params.usfm
    @version_id = @params.version_id
    @el.html("Loading")
    this.fetch()

  fetch: ->
    verse_url = "/bible/" + @version_id + "/" + @usfm + ".json"
    
    request = $.ajax verse_url,
      type: "GET"
      dataType: "json"

    request.done (data) =>
      @el.html(data.content_plain)
      $('.social-feed').trigger('refreshWookmark');
      return

    request.fail (jqXHR,status) =>
      alert "Failed verse request" + status
