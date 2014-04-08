window.Moments ?= {}

class window.Moments.RelatedFeed extends window.Moments.FeedBase

  constructor: (@params)->
    @usfm     = @params.usfm
    @version  = @params.version

    console.log("RELATED")
    console.log(@usfm)
    super(@params)
    @loadMoments()
    return

  loadMoments: ()->
    @hidePagination()
    
    @page        = @page + 1
    request_url  = "/moments/related?"
    request_url  += "page=" + @page
    request_url  += "&v=" + @version
    request_url  += "&usfm=" + @usfm

    @loadData(request_url)
    return