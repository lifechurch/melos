window.Moments ?= {}

class window.Moments.UserBookmarkFeed extends window.Moments.FeedBase

  constructor: (@params)->
    super(@params)
    @username = $('.social-feed-wrap').data('username')
    @kind = 'bookmark'
    @label = $('.social-feed-wrap').data('label')
    @loadMoments()
    return

  loadMoments: ()->
    @hidePagination()

    request_url  = "/users/#{@username}/_bookmarks?"

    request_url  += "&next_cursor=" + @next_cursor unless @next_cursor == undefined
    request_url  += "&kind=" + @kind unless @kind == undefined
    request_url  += "&label=" + @label unless @label == undefined
    @loadData(request_url)
    return

  # defined here to check for moment length, and hide pagination if there aren't any more moments.
  renderNext: ()->
    next_moment = @moments_json.shift()
    if next_moment == undefined
      @showPagination() if @moments_length > 10 or @next_cursor != null
    else
      @next_cursor = next_moment.object.next_cursor
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