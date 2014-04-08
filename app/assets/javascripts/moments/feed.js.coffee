window.Moments ?= {}

class window.Moments.Feed extends window.Moments.FeedBase

  constructor: (@params)->
    super(@params)
    @paginate_end_day = undefined
    @loadMoments()
    return


  loadMoments: ()->
    @hidePagination()

    @page        = @page + 1
    request_url  = "/moments/_cards?"
    request_url  += "page=" + @page
    request_url  += ("&paginated_end_day=" + @paginate_end_day) if @paginate_end_day?

    @loadData(request_url)
    return