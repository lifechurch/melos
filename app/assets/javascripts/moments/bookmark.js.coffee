window.Moments ?= {}

class window.Moments.Bookmark extends window.Moments.Base

  usfm: ()->
    @references()[0].usfm.join("+")

  references: ()->
    @data.references

  verseHTML: ()->
    @verse_html

  constructor: (@data, @feed)->
    @template = JST["moments/bookmark"]
    @fetch()


  render: ()->
    if @template

      @html = @template
        verse_html:   @verseHTML()
        uuid:         @generateID()
        id:           @data.id
        path:         @data.path
        created_dt:   @data.time_ago
        updated_dt:   @data.updated_dt
        moment_title: @data.moment_title
        avatar:       @data.avatar
        comments:     @data.comments
        likes:        @data.likes
        actions:      @data.actions
        labels:       @data.labels
        user:
          id:         @data.user.id
          path:       @data.user.path
          avatar:     Session.User.avatar()

      return @html

  fetch: ->
    if @references() != null
      ref     = @references()[0]
      version = ref.version_id
      usfm    = ref.usfm.join("+")
      verse_url = "/bible/#{version}/#{usfm}.json"

      request = $.ajax verse_url,
        type: "GET"
        dataType: "json"

      request.done (data) =>
        template = JST["moments/verse"]
        @verse_html = template(data)
        @feed.ready(@)
        return

      request.fail (jqXHR,status) =>
    else
      @verse_html = ""
      @feed.ready(@)