window.Moments ?= {}

class window.Moments.Highlight


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

  comments: ()->
    @data.comments

  likes: ()->
    @data.likes

  verseHTML: ()->
    @verse_html

  constructor: (@data, @feed)->
    @template = $("#moment-highlight-tmpl")
    @fetch()


  render: ()->
    if @template
      template = Handlebars.compile @template.html()
      
      html = template
        verse_html:   @verseHTML()
        id:           @data.id
        path:         @data.path
        created_dt:   @data.created_dt
        updated_dt:   @data.updated_dt
        moment_title: @data.moment_title
        avatar:       @data.avatar
        user:
          path:       @data.user.path


      return html


  fetch: ->
    ref     = @references()[0]
    version = ref.version_id
    usfm    = ref.usfm.join("+")
    verse_url = "/bible/#{version}/#{usfm}.json"
    
    request = $.ajax verse_url,
      type: "GET"
      dataType: "json"

    request.done (data) =>
      template = Handlebars.compile $("#moment-verse-tmpl").html()
      @verse_html = template(data)
      @feed.ready(@)
      return

    request.fail (jqXHR,status) =>