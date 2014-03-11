window.Moments ?= {}

class window.Moments.Generic extends window.Moments.Base

  constructor: (@data, @feed)->
    @template = $("#moment-generic-tmpl")
    @feed.ready(@)

  render: ()->
    if @template
      template = Handlebars.compile @template.html()
      
      html = template
        uuid:           @generateID()
        created_dt:     @timeAgo(@data.created_dt)
        moment_title:   @data.moment_title
        avatar:         @data.avatar
        body_text:      @data.body_text

      return html