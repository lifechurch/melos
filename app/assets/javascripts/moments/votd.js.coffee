window.Moments ?= {}

class window.Moments.VOTD extends Moments.Base

  constructor: (@data, @feed)->
    @template = $("#moment-votd-tmpl")
    @fetch()


  render: ()->
    if @template
      template = Handlebars.compile @template.html()
      
      html = template
        uuid:             @generateID()
        week_day:         @weekDay()
        created_dt:       moment(@data.created_dt).format('LL') 
        version:          @version()
        verse_html:       @verseHTML()
        references:       @references()
        usfm_references:  @references().join("+")
        recent_versions:  @recentVersions()

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
      template = Handlebars.compile $("#moment-votd-verse-tmpl").html()
      @verse_html = template(data)
      @feed.ready(@)
      return

    request.fail (jqXHR,status) =>


  versionClickHandler: (event)->
    li = $(event.currentTarget)
    return if li.hasClass("active")

    version_id = li.data("version-id")
    
    ref_link = @moment_el.find(".moment-vod-links")
    ref_link.text("Loading")
    ref_link.attr("href","#")

    @feed.refreshWookmark()

    request = $.ajax @pathForVersion(version_id),
      type: "GET"
      dataType: "json"

    request.done (data) =>
      @moment_el.find(".moment-vod-links").remove()    
      template = Handlebars.compile($("#moment-votd-verse-tmpl").html())
      wrap = @moment_el.find(".moment-votd-verse-wrap")
      wrap.replaceWith(template(data))
      wrap.addClass("loaded")
      @feed.refreshWookmark()
      #@setupScroll()
      return

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

  weekDay: ()->
    @data.week_day

  date: ()->
    @data.date

  version: ()->
    @data.version

  recentVersions: ()->
    @data.recent_versions

  verseHTML: ()->
    @verse_html
