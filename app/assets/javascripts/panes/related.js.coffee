window.Panes ?= {}

class window.Panes.Related extends window.Panes.Base

  constructor: (@params) ->
    super(@params)
    @template = $("#pane-related-tmpl")
    return

  render: ()->
    html = $(super())
    @afterRender(html)
    return html

  afterRender: (html)->
    html.on "click", (event)=>
      event.preventDefault();
      if html.hasClass("disabled") then return else window.location.href = "/moments/related/"
    return