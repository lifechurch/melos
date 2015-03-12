window.Moments ?= {}

class window.Moments.Image extends window.Moments.Base

  constructor: (@data, @feed)->
    @template = JST["moments/image"]
    @feed.ready(@)

  render: ()->
    if @template
      html = @template
        uuid:           @generateID()
        id:             @data.id
        created_dt:     moment(@data.created_dt).format('LL')
        path:           @data.path
        moment_title:   @data.moment_title
        body_text:      @data.body_text
        body_image:     @data.body_image
        avatar:         @data.avatar
        avatar_style:   @data.avatar_style
        action_url:     @data.action_url
        kind_color:     @data.kind_color
        comments:       @data.comments
        likes:          @data.likes
        actions:        @data.actions
        labels:         @data.labels
        interact_with:  true
        user:
          id:         @data.user.id
          path:       @data.user.path
          avatar:     Session.User.avatar()
      return html



  finalizeSetup: ()->
    @moment_el.find(".body-image").on 'load', ->
      $(this).show()
      $(this).parent().find(".image-loader").hide()