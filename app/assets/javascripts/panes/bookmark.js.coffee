window.Panes ?= {}

class window.Panes.Bookmark extends window.Panes.Base

  constructor: (@params) ->
    super(@params)
    @template = $("#pane-bookmark-tmpl")

  render: ()->
    html = $(super())
    @afterRender(html)
    @setupColorpicker()
    return html