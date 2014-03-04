window.Moments ?= {}

class window.Moments.Bookmark


  # {
  #   "kind": "bookmark",
  #   "object": {
  #     "id": "5099398195314688",
  #     "created_dt": "2014-02-25T20:27:36+00:00",
  #     "updated_dt": null,
  #     "moment_title": "Chris Vaughn bookmarked <b>Genesis 1:5</b>",
  #     "references": [
  #       {
  #         "human": "Genesis 1:5",
  #         "version_id": 1,
  #         "usfm": [
  #           "GEN.1.5"
  #         ]
  #       }
  #     ],
  #     "user": {
  #       "id": 7477,
  #       "user_name": "chrisvaughn"
  #     },
  #     "comments": [],
  #     "likes": []
  #   }
  # }

  usfm: ()->
    @references()[0].usfm.join("+")

  references: ()->
    @data.references

  comments: ()->
    @data.comments

  likes: ()->
    @data.likes

  verseHTML: ()->
    @verse_html

  constructor: (@data, @feed)->
    @template = $("#moment-bookmark-tmpl")
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
    if @references() != null
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
    else
      @verse_html = ""
      @feed.ready(@)