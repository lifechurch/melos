window.Moments ?= {}

class window.Moments.Feed

  constructor: ()->

    @wrap = $(".social-feed-wrap")
    @current_feed = undefined


    $("#load-more").on "click", (event)=>
      event.preventDefault()
      console.log("FROM FEED")
      pagination_link   = $(event.target)
      next_page         = pagination_link.data("page") + 1
      paginated_end_day = pagination_link.data("paginated-end-day")
      request_url       = "/moments/_cards" #?paginated_end_day=#{paginated_end_day}&page=#{next_page}" +  + "" +  + "&#{url_params.join('&')}"

      $.ajax
        type: "GET",
        url: request_url,
        dataType: "json",
        success: (data)=>

          @buildAll(data)
          return

  currentFeed: ()->
    @current_feed


  buildAll: (moments_json_array)->
    @current_feed = $("<div />",{class:"social-feed"})
    @wrap.append(@current_feed)

    $.each moments_json_array , (index,moment)=>

      switch moment.kind
        when "votd"
          new Moments.VOD(moment.object,@)
        when "highlight"
          new Moments.Highlight(moment.object,@)
        when "bookmark"
          new Moments.Bookmark(moment.object,@)
        when "note"
          new Moments.Note(moment.object,@)

  ready: (moment)->
    @currentFeed().append(moment.render())