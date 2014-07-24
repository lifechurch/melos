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
        actions:          @data.actions
        read_path:        @readPath()
        subscription:     @data.subscription

      return html


  finalizeSetup: ()->
    @version_buttons = @moment_el.find(".moment-vod-list .btn")
    @version_buttons.on "click", $.proxy(@versionClickHandler,@)

    # Activate the currently selected version button
    @version_buttons.each (index,button)=>
      btn = $(button)
      if btn.data("version-id") == @version() then btn.addClass("active")

    # Activate the subscribe link
    @vod_subscribe_layer = @moment_el.find(".moment-vod-subscribe-layer")
    @subscribe_link = @moment_el.find(".moment-action-subscribe")
    if @subscribe_link.length and @vod_subscribe_layer.length
      @subscribe_link.on "click", (e) =>
        e.preventDefault()
        @moment_el.find(".moment-votd-verse-wrap").toggleClass('mobile-hidden')
        @moment_el.find(".moment-vod-list").toggleClass('mobile-hidden')
        @moment_el.find(".moment-content-actions").toggleClass('mobile-hidden')
        @vod_subscribe_layer.toggle()
        @subscribe_link.toggle()

    # Activate the cancel button
    @cancel_button = @moment_el.find(".moment-vod-subscribe-cancel")
    if @cancel_button.length
      @cancel_button.on "click", (e) =>
        e.preventDefault()
        @moment_el.find(".moment-votd-verse-wrap").toggleClass('mobile-hidden')
        @moment_el.find(".moment-vod-list").toggleClass('mobile-hidden')
        @moment_el.find(".moment-content-actions").toggleClass('mobile-hidden')
        @vod_subscribe_layer.toggle()
        @subscribe_link.toggle()

    # Activate the vod version selector
    @vod_version_selector = @moment_el.find("#version_id")
    if @vod_version_selector.length
      @vod_version_selector.on "change", (e) =>
        if @vod_version_selector.val() == "-1"
          window.location = @data.subscription.path

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
    #try again with NT usfm
    verse_url = "/bible/#{@version()}/#{@altNTverse()}.json"

    request = $.ajax verse_url,
      type: "GET"
      dataType: "json"

    request.done (data) =>
      template = JST["moments/votd_verse"]
      @verse_html = template(data)
      @feed.ready(@)
      return

    request.fail (jqXHR,status) =>
      @verse_html = "<p class='moment-votd-verse'>" + I18n.t("moments.could not load verse") + "</p>"
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

  date: ()->
    @data.date

  version: ()->
    @data.version

  altNTverse: ()->
    altVerse = ["MAT.18.4","LUK.11.13","JHN.10.11","MAT.24.14","MRK.2.17","JHN.3.3","MAT.16.24","JHN.13.34","MAT.5.44","MAT.5.3","MRK.3.35","MAT.12.50","JHN.8.12","MAT.11.28","LUK.15.7","JHN.11.25","MAT.7.7","LUK.6.35","MRK.16.15","MAT.22.37","LUK.12.28","MAT.13.44","MAT.10.39","MAT.6.21","LUK.19.10","JHN.1.14","MAT.9.38","JHN.6.35","MAT.6.33","MRK.10.45","MAT.24.35"]
    altVerse[@data.week_day - 1]

  recentVersions: ()->
    @data.recent_versions

  verseHTML: ()->
    @verse_html

  readPath: ->
    if @references() != null
      return "/bible/#{@version()}/#{@usfm()}"
    else
      return "#"
