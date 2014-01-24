window.Panes ?= {}

class window.Panes.Note extends window.Panes.Base

  constructor: (@params) ->
    super(@params)
    @template = $("#pane-note-tmpl")

  render: ()->
    html = $(super())
    @afterRender(html)
    return html

  afterRender: (html)->
    super(html)
    @setupColorpicker()
    @note_content_field = @el.find('textarea[name="note[content]"]')