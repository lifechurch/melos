window.Moments ?= {}

class window.Moments.Friendship extends window.Moments.Base

  constructor: (@data, @feed)->
    @template = JST['moments/friendship']
    @feed.ready(@)

  render: ()->
    if @template
      html = @template
        uuid:           @generateID()
        created_dt:     @data.time_ago
        moment_title:   @data.moment_title
        avatar:         @data.avatar
        friend_path:    @data.friend_path
        friend_name:    @data.friend_name
        friend_avatar:  @data.friend_avatar

      return html