window.Moments ?= {}

class window.Moments.Moment

  constructor: (@params)->
    @moment_el      = @params.el
    @moment_id      = @moment_el.data("moment-id")
    @action_bar_el  = @moment_el.find(".moment-actions")

    @liked_link     = @action_bar_el.find(".moment-actions-like a")
    @setupLiking() if @liked_link?

    @share_button = @moment_el.find(".moment-actions-share")
    @share_button.on "click", $.proxy(@shareClickHandler,@)
    @template = $("#moment-share-layer-tmpl")

  authToken: ()->
    $('meta[name=csrf-token]').attr('content')


  setupLiking: ()->
    @liked_link.on "click", (ev)=>
      ev.preventDefault()
      if @liked_link.hasClass("liked") then @destroyLike() else @createLike()


  createLike: ()-> 
    @likeActionPending(true)
    post_data = { authenticity_token: @authToken(), moment_id: @moment_id }

    request = $.ajax "/likes",
      type: "POST",
      data: post_data,
      dataType: "json"

    request.done (data)=>
      #console.log(data)
      @liked_link.addClass("liked")
      @likeActionPending(false)

    request.fail (jqXHR,status) =>


  destroyLike: ()->
    @likeActionPending(true)
    post_data = { authenticity_token: @authToken() }

    request = $.ajax "/likes/" + @moment_id,
      type: "DELETE",
      data: post_data,
      dataType: "json"

    request.done (data)=>
      @liked_link.removeClass("liked")
      @likeActionPending(false)

    request.fail (jqXHR,status) =>


  likeActionPending: (bool)->
    class_name = "pending"
    if bool then @liked_link.addClass( class_name ) else @liked_link.removeClass( class_name )


  shareClickHandler: (event)->  
    event.preventDefault()
    @share_layer = @moment_el.find(".moment-actions-share-box")
    if @share_layer.length == 0 then @share_button.after(@template.html()) else @share_layer.toggle() 