window.Moments ?= {}

class window.Moments.Friendship

  constructor: (@data, @feed)->
    @template = $("#moment-friendship-tmpl")
    @feed.ready(@)

  render: ()->
    if @template
      template = Handlebars.compile @template.html()
      
      html = template
        created_dt:     @data.created_dt
        moment_title:   @data.moment_title
        avatar:         @data.avatar
        friend_path:    @data.friend_path
        friend_name:    @data.friend_name
        friend_avatar:  @data.friend_avatar

      return html

