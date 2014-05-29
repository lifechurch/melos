window.Moments ?= {}

class window.Moments.DetailView extends window.Moments.FeedBase

  constructor: (@params)->
    super(@params)
    @id = $('.social-detail').data("moment-id")
    @loadMoment() unless @id == undefined
    return


  loadMoment: ()->
    request_url  = "/moments/#{@id}"
    @loadData(request_url)
    return

  beginRendering: (moments_json_array)->
    @moments_json = moments_json_array
    @current_page = $("<div />",{class:"moment-detail"})
    @wrap.append(@current_page)
    @renderNext()
    return

  
  renderNext: ()->
    next_moment = @moments_json.shift()
    unless next_moment == undefined
      @renderMoment(next_moment)
    return
