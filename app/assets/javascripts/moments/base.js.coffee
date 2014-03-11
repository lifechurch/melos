window.Moments ?= {}

class window.Moments.Base

  constructor: ->


  initInteractions: ()->
    selector        = ".moment[data-uuid='" + @uuid + "']"
    @moment_el      = $(selector)
    @action_bar_el  = @moment_el.find(".moment-actions")

    if @action_bar_el.length
      link = @action_bar_el.find(".moment-actions-like a")
      @setupLiking(link) if link.length

    @comment_field_el = @moment_el.find(".comment-field")
    if @comment_field_el.length
      @comment_update_el    = @moment_el.find(".moment-comments-list")
      @setupCommenting()

    @delete_link = @moment_el.find(".moment-action-delete")
    if @delete_link.length
      @setupDeleting()

    @finalizeSetup()
    return


  finalizeSetup: ()->
    # Override this method in subclasses to finish out class specific setup.

    
  setupCommenting: ()->

    @comment_field_el.keypress (event)=>
      @commentCreateHandler(event)

    # For every .moment-comment-delete link, setup a click event listener
    @moment_el.find(".moment-comment-delete").click (event)=>
      @commentDeleteHandler(event)


  commentDeleteHandler: (event) ->
    event.preventDefault()

    el = $(event.currentTarget) # The clicked link
    el.removeAttr("href")
    
    comment_li = el.closest("li")
    comment_li.addClass("pending-delete")
    
    post_data = {
      authenticity_token: @authToken()
    }

    $.ajax 
      url: "/comments/" + el.data("comment-id"), 
      type: "DELETE",
      data: post_data,
      dataType:"json",
      success: (data)=>
        comment_li.fadeOut 200, =>
          @feed.refreshWookmark()


  commentCreateHandler: (event)->
    if event.which == 13
      event.preventDefault()
      @comment_field_el.attr("disabled", "disabled")
      post_data = {
        authenticity_token: @authToken(),
        comment: {
          content: @comment_field_el.val(),
          moment_id: @id()
        }
      }

      $.ajax 
        url: "/comments", 
        type: "POST",
        data: post_data,
        dataType:"json",
        success: (data)=>
          template = Handlebars.compile $("#comment-list-item-tmpl").html()
          @comment_update_el.append template(data)
          # Find the item we just appended, get the delete link and bind a handler to it.
          @comment_update_el.find("li").last().find(".moment-comment-delete").click (event)=>
            @commentDeleteHandler(event)

          @comment_field_el.val("").removeAttr("disabled").blur() # blur to dismiss device keyboards
          @feed.refreshWookmark()



  setupDeleting: ()->
    @delete_link.on "click", (ev)=>
      ev.preventDefault()
      
      if confirm(@moment_el.data("str-delete-confirm"))
        @moment_el.css({opacity: 0.5})
        request = $.ajax @momentPath(),
          type: "DELETE",
          data: {authenticity_token: @authToken()},
          dataType: "json"

        request.done (data)=>
          @moment_el.fadeTo 250, 0.0, ()=>
            @moment_el.remove()
            @feed.refreshWookmark()
          # if @isDetailView()
          #   window.location.href = Session.User.toPath()
          # else
          #   @moment_el.fadeTo 250, 0.0, ()=>
          #     @moment_el.remove()
          #     @refreshWookmark()
          
        request.fail (jqXHR,status)=>
          @moment_el.css({opacity: 1.0})



  setupLiking: (link)->
    @liked_link = link
    @liked_link.on "click", (ev)=>
      ev.preventDefault()
      if @liked_link.hasClass("liked") then @destroyLike() else @createLike()

  likeActionPending: (bool)->
    class_name = "pending"
    if bool then @liked_link.addClass( class_name ) else @liked_link.removeClass( class_name )


  createLike: ()-> 
    @likeActionPending(true)
    @liked_link.addClass("liked")
    post_data = { authenticity_token: @authToken(), moment_id: @id() }

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

    request = $.ajax "/likes/" + @id(),
      type: "DELETE",
      data: post_data,
      dataType: "json"

    request.done (data)=>
      @likeActionPending(false)

    # if the request fails, set the class back to it's original liked status.
    request.fail (jqXHR,status) =>
      @liked_link.addClass("liked")
      @likeActionPending(false)


  momentPath: ()->
    @data.path

  # We need to generate a UUID for html template fragments.
  # This allows us to lookup the DOM element once the fragment has been added to the DOM
  # by the generated UUID.  See subclasses and how they pass {uuid} to templates to be rendered.
  #
  # http://byronsalau.com/blog/how-to-create-a-guid-uuid-in-javascript/

  generateID: ()->
    return @uuid unless @uuid == undefined
    @uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace /[xy]/g, (c)->
      r = Math.random()*16 | 0
      v = if c == 'x' then r else (r&0x3|0x8)
      return v.toString(16)
    return @uuid

  authToken: ()->
    $('meta[name=csrf-token]').attr('content')

  id: ()->
    @data.id


  timeAgo: (timestamp)->
    moment(timestamp).fromNow()

