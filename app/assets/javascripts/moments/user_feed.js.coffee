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