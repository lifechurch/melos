window.Moments ?= {}

class window.Moments.UserFeed extends window.Moments.FeedBase

  constructor: (@params)->
    super(@params)
    @user_id = $('.social-feed-wrap').data('user-id')
    @loadMoments()
    return


  loadMoments: ()->
    @hidePagination()

    @page        = @page + 1
    request_url  = "/users/_cards?"
    request_url  += "user_id=" + @user_id
    request_url  += "&page=" + @page
    @loadData(request_url)
    return

  # defined here to check for moment length, and hide pagination if there aren't any more moments.
  renderNext: ()->
    next_moment = @moments_json.shift()
    if next_moment == undefined && @moments_length >= 10
      @showPagination()
    else
      @renderMoment(next_moment)
    return