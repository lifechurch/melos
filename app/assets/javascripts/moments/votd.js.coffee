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


    parent          = @votd_el.closest(".moment")
    @share_button   = parent.find(".moment-actions-share")
    @share_button.on "click", $.proxy(@shareClickHandler,@)
    @share_template = $("#moment-share-layer-tmpl")
    @fetch()

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


  prepareShareLinks: (html)->
    parent      = @votd_el.closest(".moment")
    verse_el    = parent.find(".moment-votd-verse")
    verse_text  = verse_el.text()
    verse_human = verse_el.data("reference-human")
    verse_path  = "http://www.bible.com" + verse_el.data("reference-path")

    # Facebook link sharing setup
    share_facebook = html.find("a.facebook")
    
    fb_app_id       = "105030176203924"
    fb_name         = verse_human
    fb_description  = verse_text
    fb_link         = verse_path
    fb_redirect     = "https://www.bible.com/moments"
    fb_destination  = "https://www.facebook.com/dialog/feed?name=" + fb_name + "&app_id=" + fb_app_id + "&description=" + fb_description + "&link=" + fb_link + "&redirect_uri=" + fb_redirect
    share_facebook.attr("href",fb_destination)

    # Twitter link sharing setup
    share_twitter   = html.find("a.twitter")
    tw_destination  = "https://twitter.com/intent/tweet?text=" + verse_text
    share_twitter.attr("href",tw_destination)



  shareClickHandler: (event)->  
    event.preventDefault()
    @share_layer    = @votd_el.closest(".moment").find(".moment-actions-share-box")

    if @share_layer.length == 0
      html = $(@share_template.html())
      @share_button.after(html)
      @prepareShareLinks(html)
    else
      @share_layer.toggle()


