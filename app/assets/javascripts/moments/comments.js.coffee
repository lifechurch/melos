window.Moments ?= {}

class window.Moments.Comments

  constructor: (@params)->
    @base_el      = @params.base
    @textfield_el = @base_el.find(".comment-field")
    @update_el    = @base_el.find(".moment-comments-list")
    @update_tmpl  = $("#comment-list-item-tmpl")
    @moment_id    = @textfield_el.data("moment-id")
    @auth_token   = $('meta[name=csrf-token]').attr('content')


    # For every .moment-comment-delete link, setup a click event listener
    @base_el.find(".moment-comment-delete").click (event)=>
      event.preventDefault();
      
      # The clicked link
      el = $(event.currentTarget)
      el.removeAttr("href")
      
      comment_li = el.closest("li")
      comment_li.addClass("pending-delete")
      
      post_data = {
        authenticity_token: @auth_token
      }

      $.ajax 
        url: "/comments/" + el.data("comment-id"), 
        type: "DELETE",
        data: post_data,
        dataType:"json",
        success: (data)=>
          comment_li.fadeOut 200, =>
            @refreshWookmark()


    @textfield_el.keypress (event)=>
      if event.which == 13
        event.preventDefault()
        @textfield_el.attr("disabled", "disabled")
        post_data = {
          authenticity_token: @auth_token,
          comment: {
            content: @textfield_el.val(),
            moment_id: @moment_id
          }
        }

        $.ajax 
          url: "/comments", 
          type: "POST",
          data: post_data,
          dataType:"json",
          success: (data)=>
            template = Handlebars.compile @update_tmpl.html()
            @update_el.append template(data)
            @textfield_el.val("").removeAttr("disabled").blur() # blur to dismiss device keyboards
            @refreshWookmark()

  refreshWookmark: ->
    $(".social-feed .moment").wookmark {
      autoResize:   true,
      offset:       15,
      container:    $(".social-feed")
    }
