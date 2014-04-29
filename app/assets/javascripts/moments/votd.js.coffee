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
        created_dt:       @data.votd_date
        version:          @version()
        verse_html:       @verseHTML()
        references:       @references()
        usfm_references:  @references().join("+")
        recent_versions:  @recentVersions()
        calendar_img:     @data.calendar_img

      return html


  finalizeSetup: ()->
    if @fallback_version
      @moment_el.find(".moment-vod-list").prepend('<li class="btn" data-version-id="1">KJV</li>')
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
      @retry()

  retry: ->
    #try again using default version
    verse_url = "/bible/#{@data.default_version_id}/#{@usfm()}.json"

    request = $.ajax verse_url,
      type: "GET"
      dataType: "json"

    request.done (data) =>
      template = JST["moments/votd_verse"]
      @fallback_version = true
      @verse_html = template(data)
      @feed.ready(@)
      return

    request.fail (jqXHR,status) =>
      @verse_html = "<p class='moment-votd-verse'>" + Ii8n.t("moments.could not load verse") + "</p>"
      @feed.ready(@)


  versionClickHandler: (event)->
    li = $(event.currentTarget)
    return if li.hasClass("active")

    version_id  = li.data("version-id")
    ref_link    = @moment_el.find(".moment-vod-links")

    ref_link.text(I18n.t("ui.loading"))
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
      wrap.html("<p class='moment-votd-verse'>" + I18n.t('moments.scripture unavailable') + "</p>")
      ref_link.text(I18n.t('moments.could not load'))
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

  fallback_version: false

  date: ()->
    @data.date

  version: ()->
    if @fallback_version
      @data.default_version_id
    else
      @data.version

  recentVersions: ()->
    @data.recent_versions

  verseHTML: ()->
    @verse_html
