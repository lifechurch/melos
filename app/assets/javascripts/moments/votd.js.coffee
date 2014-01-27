window.Moments ?= {}

class window.Moments.VOTD

  constructor: (@params)->
    @votd_el = @params.el
    @votd_version_buttons = @votd_el.find(".moment-vod-list .btn")
    @votd_version_buttons.on "click", $.proxy(@versionClickHandler,@)


  versionClickHandler: (event)->
    li        = $(event.currentTarget)
    return if li.hasClass("active")

    vid       = li.data("version-id")
    verse_el  = @votd_el.find("p.moment-vod-verse")

    verse_el.html("Loading")
    @refreshWookmark()

    request = $.ajax @path_for_version(vid),
      type: "GET"
      dataType: "json"

    request.done (data) =>
      verse_el.html(data.content_plain)
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