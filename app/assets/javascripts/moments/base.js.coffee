window.Moments ?= {}

class window.Moments.Base

  constructor: ->


  initInteractions: ()->
    selector         = ".moment[data-uuid='" + @uuid + "']"
    @moment_el       = $(selector)
    @action_bar_el   = @moment_el.find(".moment-actions")
    @more_action_el  = @moment_el.find("a.more-action")
    @action_layer_el = @moment_el.find(".action-layer")

    if @action_bar_el.length
      link = @action_bar_el.find(".moment-actions-like a")
      @setupLiking(link) if link.length

    if @more_action_el.length
      @setupActionLayer()

    @comment_field_el = @moment_el.find(".comment-field")
    if @comment_field_el.length
      @comment_update_el    = @moment_el.find(".moment-comments-list")
      @setupCommenting()

    @delete_link = @moment_el.find(".moment-action-delete")
    if @delete_link.length
      @setupDeleting()

    # TODO: move this to finalizeSetup in plan subclasses.
    @start_plan_layer = @moment_el.find(".rp-layer")
    @start_plan_link = @moment_el.find(".moment-action-start-plan")
    if @start_plan_link.length and @start_plan_layer.length
      @setupStartPlan()

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
          @feed.refreshWookmark(@moment_el.closest(".social-feed"))


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
          template = JST["moments/comment_list_item"]
          @comment_update_el.append template(data)
          # Find the item we just appended, get the delete link and bind a handler to it.
          @comment_update_el.find("li").last().find(".moment-comment-delete").click (event)=>
            @commentDeleteHandler(event)

          @comment_field_el.val("").removeAttr("disabled").blur() # blur to dismiss device keyboards
          @feed.refreshWookmark(@moment_el.closest(".social-feed"))

  # todo: add this to finalize in plan subclass
  setupStartPlan: ()->
    @start_plan_link.on "click", (ev)=>
      ev.preventDefault()
      @start_plan_layer.toggleClass("hide")
      @action_layer_el.addClass("hide")
    @cancel_button = @moment_el.find(".button-plan-cancel")
    if @cancel_button.length
      @cancel_button.on "click", (ev)=>
        ev.preventDefault()
        @start_plan_layer.toggleClass("hide")
    @post_links = @moment_el.find(".plan-privacy-buttons .button-wrap a")
    if @post_links.length
      @post_links.attr('data-method', 'post')


  setupDeleting: ()->
    @delete_link.on "click", (ev)=>
      ev.preventDefault()

      if confirm(@moment_el.data("str-delete-confirm"))
        @moment_el.css({opacity: 0.5})
        request = $.ajax @momentPath(),
          type: "DELETE",
          data: {authenticity_token: @authToken()},
          dataType: "json"

        feed = @moment_el.closest(".social-feed")

        request.done (data)=>
          @moment_el.fadeTo 250, 0.0, ()=>
            @moment_el.remove()
            @feed.refreshWookmark(feed)
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
    @liked_link.addClass("liked") if @data.likes.is_liked
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

  setupActionLayer: ()->
    if @action_layer_el.find("li").length
      @more_action_el.on "click", (ev)=>
        ev.preventDefault()
        @action_layer_el.toggleClass("hide")
      @share_action_el = @action_layer_el.find(".share-action-link")
      if @share_action_el.length
        @share_layer_el = @action_layer_el.find('.moment-share-layer')
        @share_action_el.on "click", (ev)=>
          ev.preventDefault()
          if @share_action_el.hasClass("open")
            @share_layer_el.slideUp()
            @share_action_el.removeClass('open')
          else
            @share_layer_el.slideDown()
            @share_action_el.addClass('open')

    else
      @more_action_el.addClass("hide")

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
    # no longer used - so i18n can happen in one place api_dt_time_ago()
    moment(timestamp).fromNow()

