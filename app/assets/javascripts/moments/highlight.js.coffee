window.Moments ?= {}

class window.Moments.Highlight extends window.Moments.Base


  # {
  #   "kind": "highlight",
  #   "object": {
  #     "id": "5744918895001600",
  #     "created_dt": "2014-02-27T20:30:27+00:00",
  #     "updated_dt": "2014-02-27T20:30:27+00:00",
  #     "moment_title": "You highlighted <b>John 1:6-8</b>",
  #     "references": [
  #       {
  #         "human": "John 1:6-8",
  #         "version_id": 97,
  #         "usfm": [
  #           "JHN.1.6",
  #           "JHN.1.7",
  #           "JHN.1.8"
  #         ]
  #       }
  #     ],
  #     "user": {
  #       "id": 7476,
  #       "user_name": "BrittTheNoob"
  #     },
  #     "comments": [],
  #     "likes": []
  #   }
  # }

  toPath: ()->

  usfm: ()->
    @references()[0].usfm.join("+")

  references: ()->
    @data.references

  user: ()->
    @data.user

  verseHTML: ()->
    @verse_html

  constructor: (@data, @feed)->
    @template = JST["moments/highlight"]#$("#moment-highlight-tmpl")
    @fetch()


  render: ()->
    if @template
      #template = Handlebars.compile @template.html()

      html = @template
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
        read_path:    @readPath()
        user:
          id:         @data.user.id
          path:       @data.user.path
          avatar:     Session.User.avatar()

      return html


  fetch: ->
    return if @references() == undefined
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

  readPath: ->
    if @references() != null
      ref     = @references()[0]
      version = ref.version_id
      usfm    = ref.usfm.join("+")
      return "/bible/#{version}/#{usfm}"
    else
      return "#"