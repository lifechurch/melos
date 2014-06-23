window.Moments ?= {}

class window.Moments.Note extends window.Moments.Base

  usfm: ()->
    @references()[0].usfm.join("+")


  references: ()->
    @data.references

  user: ()->
    @data.user

  constructor: (@data, @feed)->
    @template = JST["moments/note"]
    @feed.ready(@)

  render: ()->
    if @template

      html = @template
        uuid:         @generateID()
        id:           @data.id
        path:         @data.path
        avatar:       @data.avatar
        status:       @data.status
        title:        @data.title
        content:      @formatContent(@data.content)
        created_dt:   @data.time_ago
        updated_dt:   @data.updated_dt
        moment_title: @data.moment_title
        comments:     @data.comments
        likes:        @data.likes
        actions:      @data.actions
        read_path:    @readPath()
        user:
          id:         @data.user.id
          path:       @data.user.path
          avatar:     Session.User.avatar()

      return html

  readPath: ->
    if @references() != null
      ref     = @references()[0]
      version = ref.version_id
      usfm    = ref.usfm.join("+")
      return "/bible/#{version}/#{usfm}"
    else
      return "#"

  formatContent: (content)->
    if content
      return content.replace(/(?:\r\n|\r|\n)/g, '<br>')
    else
      return ""
