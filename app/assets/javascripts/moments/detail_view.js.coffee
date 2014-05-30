window.Moments ?= {}

class window.Moments.DetailView extends window.Moments.FeedBase

  constructor: (@params={})->
    $.extend(@params, {el: '.social-detail'})
    super(@params)
    @id = $('.social-detail').data("moment-id")
    @loadMoment() unless @id == undefined
    @timeline = $('.moment-activity')
    @timeline.hide()
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
      @showTimeline()
    return

  showTimeline: ()->
    fade_speed = 800
    @timeline.fadeIn(fade_speed)