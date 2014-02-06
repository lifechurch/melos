window.Moments ?= {}

class window.Moments.VOTD

  constructor: (@params)->
    @votd_el = @params.el
    @votd_verse = @votd_el.find(".moment-votd-verse")
    @usfm       = @votd_verse.data("usfm")
    @version_id = @votd_verse.data("version-id")
    @template   = $("#moment-votd-verse-tmpl")
    
    @votd_version_buttons = @votd_el.find(".moment-vod-list .btn")
    @votd_version_buttons.on "click", $.proxy(@versionClickHandler,@)

    this.fetch()


  fetch: ->
    verse_url = "/bible/" + @version_id + "/" + @usfm + ".json"
    
    request = $.ajax verse_url,
      type: "GET"
      dataType: "json"

    request.done (data) =>
      template = Handlebars.compile(@template.html())
      wrap = @votd_el.find(".moment-votd-verse-wrap")
      wrap.replaceWith(template(data))
      wrap.addClass("loaded")
      $('.social-feed').trigger('refreshWookmark')
      return

    request.fail (jqXHR,status) =>
      @votd_verse.html("Could not load verse.")


  versionClickHandler: (event)->
    li        = $(event.currentTarget)
    return if li.hasClass("active")

    vid       = li.data("version-id")
    
    ref_link = @votd_el.find(".moment-vod-links")
    ref_link.text("Loading")
    ref_link.attr("href","#")

    @refreshWookmark()

    request = $.ajax @path_for_version(vid),
      type: "GET"
      dataType: "json"

    request.done (data) =>
      @votd_el.find(".moment-vod-links").remove()    
      template = Handlebars.compile(@template.html())
      wrap = @votd_el.find(".moment-votd-verse-wrap")
      wrap.replaceWith(template(data))
      wrap.addClass("loaded")
      @refreshWookmark()
      return

    @votd_version_buttons.removeClass("active")
    li.addClass("active")


  path_for_version: (vid)->
    "/bible/" + vid + "/" + @references_string() + ".json"


  references_string: ()->
    @votd_el.data("references")


  refreshWookmark: ()->
    $('.social-feed').trigger('refreshWookmark')