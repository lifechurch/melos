window.Panes ?= {}

class window.Panes.Highlight extends window.Panes.Base

  constructor: (@params) ->
    super(@params)
    @template    = $("#pane-highlight-tmpl")


  getHighlightedVerses: ()->
    return $('.verse.selected.highlighted')


  formatIcons: (highlights)->
    if highlights.length
      $('#highlight_9').addClass('hide')
      $('#clear_highlights').removeClass('hide')
    else
      $('#clear_highlights').addClass('hide')
      $('#highlight_9').removeClass('hide')


  render: ()->
    html = $(super())
    @afterRender(html)
    return html


  afterRender: (html)->
    super(html)
    @setupColorpicker()
    return