window.Moments ?= {}

class window.Moments.CommentForm

  constructor: (@params)->
    @element      = @params.textarea  # textarea of comment
    @updating     = @params.update      # list of comments to update
    @template     = @params.template
    @moment_id    = @element.data("moment-id")
    @auth_token   = $('meta[name=csrf-token]').attr('content')
    

    @element.keypress (event)=>
      if event.which == 13
        event.preventDefault()
        @element.attr("disabled", "disabled")
        post_data = {
          authenticity_token: @auth_token,
          comment: {
            content: @element.val(),
            moment_id: @moment_id
          }
        }

        $.ajax 
          url: "/comments", 
          type: "POST",
          data: post_data,
          dataType:"json",
          success: (data)=>
            template = Handlebars.compile @template.html()
            @updating.append template(data)
            @element.val("").removeAttr("disabled").blur() # blur to dismiss device keyboards
            @refreshWookmark()

  refreshWookmark: ->
    $(".social-feed .moment").wookmark {
      autoResize:   true,
      offset:       15,
      container:    $(".social-feed")
    }