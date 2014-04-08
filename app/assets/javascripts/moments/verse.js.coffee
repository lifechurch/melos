window.Moments ?= {}

class window.Moments.Verse
  constructor: (@params)->
    @el         = @params.el
    @usfm       = @el.data("usfm")
    @version_id = @el.data("version-id")
    @template = '<p class="moment-verse">{{content_plain}}</p><a href="{{to_path}}" title="#{t(\'moments.action.go to scripture\')}" class="moment-verse-link">{{human}} {{version_string}}</a>'
    @el.html("Loading")
    this.fetch()

  fetch: ->
    verse_url = "/bible/" + @version_id + "/" + @usfm + ".json"

    request = $.ajax verse_url,
      type: "GET"
      dataType: "json"

    request.done (data) =>
      template = Handlebars.compile(@template)
      @el.parent().html(template(data))
      @el.removeClass("empty").addClass("loaded")
      $('.social-feed').trigger('refreshWookmark')
      return

    request.fail (jqXHR,status) =>
      @el.html("Could not load verse.")
