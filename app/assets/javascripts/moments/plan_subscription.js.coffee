window.Moments ?= {}

class window.Moments.PlanCompletion extends window.Moments.Base

  user: ()->
    @data.user

  constructor: (@data, @feed)->
    @template = JST["moments/plan_subscription"]
    @feed.ready(@)

  render: ()->
    if @template
      console.log @data
      html = @template
        uuid:         @generateID()
        id:           @data.id
        path:         @data.path
        action_url:   @data.action_url
        avatar:       @data.avatar
        status:       @data.status
        title:        @data.title
        body_text:    @data.body_text
        created_dt:   @data.time_ago
        updated_dt:   @data.updated_dt
        moment_title: @data.moment_title
        comments:     @data.comments
        likes:        @data.likes
        actions:      @data.actions
        user:
          path:       @data.user.path

      return html