window.Moments ?= {}

class window.Moments.CommentForm

  constructor: (@params)->
    @textarea = @params.textarea
    
    @textarea.keypress (event)->
      
      if event.which == 13
        event.preventDefault()
        field = $(event.target)
        field.closest("form").submit()
        field.attr("disabled", "disabled")