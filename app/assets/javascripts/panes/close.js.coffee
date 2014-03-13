window.Panes ?= {}

class window.Panes.Close extends window.Panes.Base

  constructor: (@params) ->
    super(@params)
    @template = $("#pane-close-tmpl")
    return

  render: ()->
    html = $(super())
    @afterRender(html)
    return html

  afterRender: (html)->
    html.on "click", (event)=>
      event.preventDefault()
      Events.Emitter.emit("panes:cleared")

    return