window.Moments ?= {}

class window.Moments.VOD


  # {
  #   "kind": "votd",
  #   "object": {
  #     "references": [
  #       "LUK.2.6",
  #       "LUK.2.7"
  #     ],
  #     "day": 62,
  #     "week_day": 3,
  #     "date": "2014-03-03",
  #     "created_dt": "2014-03-03T00:00:00+00:00",
  #     "version": 97,
  #     "recent_versions": [
  #       97,
  #       1
  #     ]
  #   }
  # }

  constructor: (@data, @feed)->
    @template = $("#moment-votd-tmpl")
    @fetch()


  render: ()->
    if @template
      template = Handlebars.compile @template.html()
      
      html = template
        week_day:         @weekDay()
        created_dt:       @createdDt()
        version:          @version()
        verse_html:       @verseHTML()
        references:       @references()
        usfm_references:  @references().join("+")
        recent_versions:  @recentVersions()

      return html


  fetch: ->
    verse_url = "/bible/#{@version()}/#{@usfm()}.json"
    
    request = $.ajax verse_url,
      type: "GET"
      dataType: "json"

    request.done (data) =>
      template = Handlebars.compile $("#moment-votd-verse-tmpl").html()
      @verse_html = template(data)
      @feed.ready(@)
      return

    request.fail (jqXHR,status) =>


  references: ()->
    @data.references

  usfm: ()->
    @references().join("+")

  day: ()->
    @data.day

  weekDay: ()->
    @data.week_day

  date: ()->
    @data.date

  createdDt: ()->
    @data.created_dt

  version: ()->
    @data.version

  recentVersions: ()->
    @data.recent_versions

  verseHTML: ()->
    @verse_html
