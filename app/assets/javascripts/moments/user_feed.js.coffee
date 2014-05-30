window.Moments ?= {}

class window.Moments.UserFeed extends window.Moments.FeedBase

  constructor: (@params)->
    super(@params)
    @username = $('.social-feed-wrap').data('username')
    @kind = $('.social-feed-wrap').data('kind')
    @loadMoments()
    return


  loadMoments: ()->
    @hidePagination()

    @page        = @page + 1
    request_url  = "/users/#{@username}/_cards?"
    request_url  += "&page=" + @page unless @page == undefined
    request_url  += "&kind=" + @kind unless @kind == undefined
    @loadData(request_url)
    return

  # defined here to check for moment length, and hide pagination if there aren't any more moments.
  renderNext: ()->
    next_moment = @moments_json.shift()
    if next_moment == undefined
      @showPagination() unless @moments_length < 10
    else
      @renderMoment(next_moment)
    return

  # defined here to show the blank slate if the array comes back blank
  beginRendering: (moments_json_array)->
    @moments_json = moments_json_array
    @moments_length = @moments_json.length
    if @page == 1 and @moments_length == 0
      $('.profile-blank-slate').show()
    else
      @current_page = $("<div />",{class:"social-feed"})
      @wrap.append(@current_page)
      @renderNext()
    return