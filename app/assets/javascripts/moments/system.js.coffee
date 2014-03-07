window.Moments ?= {}

class window.Moments.System

  constructor: (@data, @feed)->
    @template = $("#moment-system-tmpl")
    @feed.ready(@)

  render: ()->
    if @template
      template = Handlebars.compile @template.html()
      
      html = template
        created_dt:     @data.created_dt
        moment_title:   @data.moment_title
        body_text:      @data.body_text
        body_image:     @data.body_image

      return html