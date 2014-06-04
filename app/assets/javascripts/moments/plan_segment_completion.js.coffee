window.Moments ?= {}

class window.Moments.PlanSegmentCompletion extends window.Moments.Base

  user: ()->
    @data.user

  constructor: (@data, @feed)->
    @template = JST["moments/plan_segment_completion"]
    @feed.ready(@)
    @initProgressBars()

  render: ()->
    if @template

      html = @template
        uuid:         @generateID()
        id:           @data.id
        path:         @data.path
        action_url:   @data.action_url
        plan_day_path: @data.action_url + "/day/" + @data.segment
        avatar:       @data.avatar
        status:       @data.status
        title:        @data.title
        percent_complete: @data.percent_complete
        segment:      @data.segment
        total_segments: @data.total_segments
        created_dt:   @data.time_ago
        updated_dt:   @data.updated_dt
        moment_title: @data.moment_title
        comments:     @data.comments
        likes:        @data.likes
        actions:      @data.actions
        user:
          id:         @data.user.id
          path:       @data.user.path
          avatar:     Session.User.avatar() 

      return html

  initProgressBars: ()->
    progress_bar = $(".progress_bar")
    return unless progress_bar.length
    speed = 1500
    progress_bar.each (index, el) =>
      return if $(el).css('visibility') == 'visible'
      
      width = $(el).data('percent-complete')
      raw_width = parseInt(width, 10)

      $(el).css
        width: '14px',
        visibility: 'visible'

      if raw_width > 4
        $(el).delay(250).animate
          width: width
        , speed