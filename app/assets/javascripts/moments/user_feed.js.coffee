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