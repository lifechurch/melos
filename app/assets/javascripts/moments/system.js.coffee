window.Moments ?= {}

class window.Moments.System extends window.Moments.Base

  constructor: (@data, @feed)->
    @template = JST["moments/system"]
    @feed.ready(@)

  render: ()->
    if @template

      html = @template
        uuid:           @generateID()
        created_dt:     moment(@data.created_dt).format('LL')
        moment_title:   @data.moment_title
        body_text:      @data.body_text
        body_image:     @data.body_image

      return html