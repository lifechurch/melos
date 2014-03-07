window.Moments ?= {}

class window.Moments.Feed

  constructor: ()->

    @wrap = $(".social-feed-wrap")
    @current_feed = undefined


    $("#load-more").on "click", (event)=>
      event.preventDefault()
      pagination_link   = $(event.target)
      next_page         = pagination_link.data("page") + 1
      paginated_end_day = pagination_link.data("paginated-end-day")
      request_url       = "/moments/_cards" #?paginated_end_day=#{paginated_end_day}&page=#{next_page}" +  + "" +  + "&#{url_params.join('&')}"

      $.ajax
        type: "GET",
        url: request_url,
        dataType: "json",
        success: (data)=>
          @beginRendering(data)
          return

  currentFeed: ()->
    @current_feed


  renderNext: ()->
    next_moment = @moments_json.shift()
    return if next_moment == undefined
    
    @renderMoment(next_moment)
    return


  renderMoment: (moment)->
    data = moment.object
    switch moment.kind
      when "votd"
        new Moments.VOD(data,@)
      when "highlight"
        new Moments.Highlight(data,@)
      when "bookmark"
        new Moments.Bookmark(data,@)
      when "note"
        new Moments.Note(data,@)
      when "friendship"
        new Moments.Friendship(data,@)
      else
        @renderNext()


  beginRendering: (moments_json_array)->
    @moments_json = moments_json_array
    @current_feed = $("<div />",{class:"social-feed"})
    @wrap.append(@current_feed)
    
    @renderNext()
    return


  ready: (moment)->
    @currentFeed().append(moment.render())
    @refereshWookmark()
    @renderNext()
    return

  refereshWookmark: ()->
    @current_feed.find(".moment").wookmark
      autoResize:   true,
      offset:       15,
      container:    @current_feed