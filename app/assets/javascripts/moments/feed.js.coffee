window.Moments ?= {}

class window.Moments.Feed

  constructor: (@params)->
    @wrap = if @params? and @params.el? then $(@params.el) else $(".social-feed-wrap")
    @page             = 0
    @paginate_end_day = undefined
    @current_page     = undefined

    @loadMoments()
    return

    #$("#load-more").on "click", $.proxy(@loadMoreHandler,@)


  currentPage: ()->
    @current_page


  renderNext: ()->
    next_moment = @moments_json.shift()
    return if next_moment == undefined
    
    @renderMoment(next_moment)
    return


  loadMoreHandler: (event)->
    event.preventDefault()
    @loadMoments()
    return

  loadMoments: ()->
    @page        = @page + 1
    request_url  = "/moments/_cards?"
    request_url  += "page=" + @page
    request_url  += ("&paginated_end_day=" + @paginate_end_day) if @paginate_end_day?

    console.log(request_url)

    $.ajax
      type: "GET",
      url: request_url,
      dataType: "json",
      success: (data)=>
        @beginRendering(data)
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
      when "generic"
        new Moments.Generic(data,@)
      when "system"
        new Moments.System(data,@)  
      else
        @renderNext()


  beginRendering: (moments_json_array)->
    @moments_json = moments_json_array
    @current_page = $("<div />",{class:"social-feed"})
    @wrap.append(@current_page)
    
    @renderNext()
    return


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

  refreshWookmark: ()->
    @current_page.find(".moment").wookmark
      autoResize:   true,
      offset:       15,
      container:    @current_page