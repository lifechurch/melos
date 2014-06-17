window.Moments ?= {}

class window.Moments.Friendship extends window.Moments.Base

  constructor: (@data, @feed)->
    @template = JST['moments/friendship']
    @token = $("meta[name='csrf-token']").attr("content")
    @feed.ready(@)

  render: ()->
    if @template
      html = @template
        id:             @data.id
        uuid:           @generateID()
        path:           "/moments/#{@data.id}"
        created_dt:     @data.time_ago
        moment_title:   @data.moment_title
        avatar:         @data.avatar
        friend_path:    @data.friend_path
        friend_name:    @data.friend_name
        friend_avatar:  @data.friend_avatar
        friendship_offer_path: @data.friendship_offer_path
        comments:       @data.comments
        likes:          @data.likes
        token:          @token
        user:
          id:         @data.user.id
          path:       @data.user.path
          avatar:     Session.User.avatar()
      return html