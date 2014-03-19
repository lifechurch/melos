window.Moments ?= {}

class window.Moments.VOTD extends Moments.Base

  constructor: (@data, @feed)->
    @template = JST["moments/votd"]
    @fetch()


  render: ()->
    if @template      
      html = @template
        uuid:             @generateID()
        title:            @data.title
        week_day:         @data.week_day
        created_dt:       moment(@data.created_dt).format('LL')
        version:          @version()
        verse_html:       @verseHTML()
        references:       @references()
        usfm_references:  @references().join("+")
        recent_versions:  @recentVersions()
        calendar_img:     @data.calendar_img

      return html


  finalizeSetup: ()->

    @version_buttons = @moment_el.find(".moment-vod-list .btn")
    @version_buttons.on "click", $.proxy(@versionClickHandler,@)

    # Activate the currently selected version button
    @version_buttons.each (index,button)=>
      btn = $(button)
      if btn.data("version-id") == @version() then btn.addClass("active")
        


  fetch: ->
    verse_url = "/bible/#{@version()}/#{@usfm()}.json"
    
    request = $.ajax verse_url,
      type: "GET"
      dataType: "json"

    request.done (data) =>
      template = JST["moments/votd_verse"]
      @verse_html = template(data)
      @feed.ready(@)
      return

    request.fail (jqXHR,status) =>
      @verse_html = "<p class='moment-votd-verse'>Could not load verse</p>"
      @feed.ready(@)


  versionClickHandler: (event)->
    li = $(event.currentTarget)
    return if li.hasClass("active")

    version_id  = li.data("version-id")
    ref_link    = @moment_el.find(".moment-vod-links")
    
    ref_link.text("Loading")
    ref_link.attr("href","#")

    request = $.ajax @pathForVersion(version_id),
      type: "GET"
      dataType: "json"

    request.done (data) =>
      @moment_el.find(".moment-vod-links").remove()    
      template = JST["moments/votd_verse"]
      wrap = @moment_el.find(".moment-votd-verse-wrap")
      wrap.replaceWith(template(data))
      wrap.addClass("loaded")
      @feed.refreshWookmark()
      #@setupScroll()

    request.fail (jqXHR,status)=>
      wrap = @moment_el.find(".moment-votd-verse-wrap")
      wrap.html("<p class='moment-votd-verse'>Scripture unavailable.</p>")
      ref_link.text("Could not load")
      @feed.refreshWookmark()

    @version_buttons.removeClass("active")
    li.addClass("active")


  pathForVersion: (vid)->
    "/bible/" + vid + "/" + @usfm() + ".json"

  references: ()->
    @data.references

  usfm: ()->
    @references().join("+")

  day: ()->
    @data.day

  date: ()->
    @data.date

  version: ()->
    @data.version

  recentVersions: ()->
    @data.recent_versions

  verseHTML: ()->
    @verse_html
