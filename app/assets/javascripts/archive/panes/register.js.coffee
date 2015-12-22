window.Panes ?= {}

class window.Panes.Register extends window.Panes.Base

  constructor: (@params) ->
    super(@params)
    @template = $("#pane-register-tmpl")
    return

  render: ()->
    html = $(super())
    @afterRender(html)
    return html