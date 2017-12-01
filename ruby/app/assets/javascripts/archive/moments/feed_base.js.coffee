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
    $('#spinner').hide()
    return

  showSpinner: ()->
    $('#spinner').show()
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
      when "reading_plan_carousel"
        new Moments.ReadingPlanCarousel(data,@)
      when "image"
        new Moments.Image(data,@)
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