window.Moments ?= {}

class window.Moments.FeedBase

  constructor: (@params)->
    @wrap         = if @params? and @params.el? then $(@params.el) else $(".social-feed-wrap")
    @pagination   = $("<a />", {href: "#", id: "load-more"}).text(I18n.t("moments.action.load more")).hide()
    @page         = if @params? and @params.page? then $(@params.page) else 0
    @current_page = undefined

    return


  currentPage: ()->
    @current_page


  hidePagination: ()->
    @pagination.hide()
    return

  showPagination: ()->
    unless @pagination.hasClass("loaded")
      @wrap.after(@pagination)
      @pagination.addClass("loaded")
      @pagination.on "click", $.proxy(@loadMoreHandler,@)

    @pagination.show()

  hideSpinner: ()->
    @spinner.stop()
    $('#spinner').hide()
    return

  showSpinner: ()->
    opts =
      lines: 13 # The number of lines to draw
      length: 20 # The length of each line
      width: 10 # The line thickness
      radius: 30 # The radius of the inner circle
      corners: 1 # Corner roundness (0..1)
      rotate: 0 # The rotation offset
      direction: 1 # 1: clockwise -1: counterclockwise
      color: '#000' # #rgb or #rrggbb or array of colors
      speed: 1 # Rounds per second
      trail: 60 # Afterglow percentage
      shadow: false # Whether to render a shadow
      hwaccel: false # Whether to use hardware acceleration
      className: 'spinner' # The CSS class to assign to the spinner
      zIndex: 2e9 # The z-index (defaults to 2000000000)
      top: '50%' # Top position relative to parent
      left: '50%' # Left position relative to parent
    @spinner = new Spinner(opts).spin(document.getElementById('spinner'))

    return

  loadData: (request_url)->
    @showSpinner()
    $.ajax
      type: "GET",
      url: request_url,
      dataType: "json",
      success: (data)=>
        @beginRendering(data)
        return       
      complete: (data)=>
        @hideSpinner()
        #todo: error message

  loadMoreHandler: (event)->
    event.preventDefault()
    @loadMoments()
    return

  beginRendering: (moments_json_array)->
    @moments_json = moments_json_array
    @moments_length = @moments_json.length
    @current_page = $("<div />",{class:"social-feed"})
    @wrap.append(@current_page)
    @hideSpinner()
    @renderNext()
    return


  renderNext: ()->
    next_moment = @moments_json.shift()
    if next_moment == undefined
      @showPagination()
    else
      @renderMoment(next_moment)
    return

  renderMoment: (moment)->
    data = moment.object
    switch moment.kind
      when "votd"
        new Moments.VOTD(data,@)
      when "highlight"
        new Moments.Highlight(data,@)
      when "bookmark"
        new Moments.Bookmark(data,@)
      when "note"
        new Moments.Note(data,@)
      when "friendship"
        new Moments.Friendship(data,@)
      when "plan_completion"
        new Moments.PlanCompletion(data,@)
      when "plan_subscription"
        new Moments.PlanSubscription(data,@)
      when "plan_segment_completion"
        new Moments.PlanSegmentCompletion(data,@)
      when "generic"
        new Moments.Generic(data,@)
      when "system"
        new Moments.System(data,@)
      else
        @renderNext()

  ready: (moment)->
    fade_speed = 300
    $(moment.render()).hide().appendTo(@currentPage()).fadeIn(fade_speed)
    @initMomentInteraction(moment) # have to call this after appending html to DOM to setup event listeners
    @refreshWookmark()
    @renderNext()
    return

  initMomentInteraction: (moment)->
    moment.initInteractions()
    return

  refreshWookmark: (page)->
    page_scope = if page? then page else @current_page
    page_scope.find(".moment").wookmark
      autoResize:   true,
      offset:       15,
      container:    page_scope