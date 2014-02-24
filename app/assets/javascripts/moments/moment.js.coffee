window.Moments ?= {}

class window.Moments.Moment

  constructor: (@params)->
    @moment_el      = @params.el
    @moment_id      = @moment_el.data("moment-id")
    @moment_path    = @moment_el.data("moment-path")
    @action_bar_el  = @moment_el.find(".moment-actions")

    @liked_link     = @action_bar_el.find(".moment-actions-like a")
    @setupLiking() if @liked_link?

    @delete_link    = @action_bar_el.find(".moment-action-delete")
    @setupDeleting() if @delete_link?



  authToken: ()->
    $('meta[name=csrf-token]').attr('content')


  isDetailView: ()->
    document.URL.indexOf(@moment_path) > 1


  setupDeleting: ()->
    @delete_link.on "click", (ev)=>
      ev.preventDefault()
      
      if confirm(@moment_el.data("str-delete-confirm"))
        @moment_el.css({opacity: 0.5})
        request = $.ajax @moment_path,
          type: "DELETE",
          data: {authenticity_token: @authToken()},
          dataType: "json"

        request.done (data)=>
          if @isDetailView()
            window.location.href = Session.User.toPath()
          else
            @moment_el.fadeTo 250, 0.0, ()=>
              @moment_el.remove()
              @refreshWookmark()
          
        request.fail (jqXHR,status)=>
          @moment_el.css({opacity: 1.0})

  setupLiking: ()->
    @liked_link.on "click", (ev)=>
      ev.preventDefault()
      if @liked_link.hasClass("liked") then @destroyLike() else @createLike()



  createLike: ()-> 
    @likeActionPending(true)
    @liked_link.addClass("liked")
    post_data = { authenticity_token: @authToken(), moment_id: @moment_id }

    request = $.ajax "/likes",
      type: "POST",
      data: post_data,
      dataType: "json"

    request.done (data)=>
      @likeActionPending(false)

    # if the request fails, set the class back to it's original unliked status.
    request.fail (jqXHR,status) =>
      @liked_link.removeClass("liked")
      @likeActionPending(false)

  destroyLike: ()->
    @likeActionPending(true)
    @liked_link.removeClass("liked")
    post_data = { authenticity_token: @authToken() }

    request = $.ajax "/likes/" + @moment_id,
      type: "DELETE",
      data: post_data,
      dataType: "json"

    request.done (data)=>
      @likeActionPending(false)

    # if the request fails, set the class back to it's original liked status.
    request.fail (jqXHR,status) =>
      @liked_link.addClass("liked")
      @likeActionPending(false)


  likeActionPending: (bool)->
    class_name = "pending"
    if bool then @liked_link.addClass( class_name ) else @liked_link.removeClass( class_name )

  refreshWookmark: ->
    $(".social-feed .moment").wookmark {
      autoResize:   true,
      offset:       15,
      container:    $(".social-feed")
    }