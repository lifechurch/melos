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
    request_url  = @getLocale() + "/moments/_cards?"
    request_url  += "page=" + @page
    request_url  += ("&paginated_end_day=" + @paginate_end_day) if @paginate_end_day?

    @loadData(request_url)
    return

  getLocale: ()->
    locale          = ""
    html_locale     = $('html').data("locale")
    if html_locale != "en" then locale = "/" + html_locale
    return locale