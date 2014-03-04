  # {
  #   "kind": "note",
  #   "object": {
  #     "title": "Time test",
  #     "content": "This is a test",
  #     "status": "public",
  #     "id": "5694368874758144",
  #     "created_dt": "2014-02-14T21:39:56+00:00",
  #     "updated_dt": null,
  #     "moment_title": "Bryan Test added a note, <b>Time test</b>",
  #     "references": [
  #       {
  #         "human": "John 1:3",
  #         "version_id": 1,
  #         "usfm": [
  #           "JHN.1.3"
  #         ]
  #       }
  #     ],
  #     "user": {
  #       "id": 7474,
  #       "user_name": "bdmtest"
  #     },
  #     "comments": [],
  #     "likes": []
  #   }
  # }


window.Moments ?= {}

class window.Moments.Note

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

  constructor: (@data, @feed)->
    @template = $("#moment-note-tmpl")
    @feed.ready(@)

  render: ()->
    if @template
      template = Handlebars.compile @template.html()
      
      html = template
        id:           @data.id
        path:         @data.path
        avatar:       @data.avatar
        status:       @data.status
        title:        @data.title
        content:      @data.content
        created_dt:   @data.created_dt
        updated_dt:   @data.updated_dt
        moment_title: @data.moment_title
        user:
          path:       @data.user.path

      return html