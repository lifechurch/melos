window.Moments ?= {}

class window.Moments.Note extends window.Moments.Base

  usfm: ()->
    @references()[0].usfm.join("+")


  references: ()->
    @data.references

  user: ()->
    @data.user

  constructor: (@data, @feed)->
    @template = $("#moment-note-tmpl")
    @feed.ready(@)

  render: ()->
    if @template
      template = Handlebars.compile @template.html()
      
      html = template
        uuid:         @generateID()
        id:           @data.id
        path:         @data.path
        avatar:       @data.avatar
        status:       @data.status
        title:        @data.title
        content:      @data.content
        created_dt:   @timeAgo(@data.created_dt)
        updated_dt:   @data.updated_dt
        moment_title: @data.moment_title
        comments:     @data.comments
        likes:        @data.likes
        actions:      @data.actions
        user:
          path:       @data.user.path

      return html