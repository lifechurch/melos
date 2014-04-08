window.Moments ?= {}

class window.Moments.Verse
  constructor: (@params)->
    @el         = @params.el
    @usfm       = @el.data("usfm")
    @version_id = @el.data("version-id")
    @template = JST["moments/verse"]
    @el.html("Loading")
    this.fetch()

  fetch: ->
    verse_url = "/bible/" + @version_id + "/" + @usfm + ".json"

    request = $.ajax verse_url,
      type: "GET"
      dataType: "json"

    request.done (data) =>
      @el.parent().html(@template(data))
      @el.removeClass("empty").addClass("loaded")
      $('.social-feed').trigger('refreshWookmark')
      return

    request.fail (jqXHR,status) =>
      @el.html("Could not load verse.")
