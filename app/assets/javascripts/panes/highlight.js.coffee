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
    @setupFormAjax(html)
    return

  setupFormAjax: (html)->
    form = html.find("form")
    form.on "submit", (event)=>
      event.preventDefault()

      action = form.attr("action")
      post_data = {
        authenticity_token: form.find("input[name='authenticity_token']").val()
        highlight: {
          version_id: form.find("input[name='highlight[version_id]']").val(),
          usfm_references: form.find("input[name='highlight[usfm_references]']").val(),
          color: form.find("input[name='highlight[color]']").val()
        }
      }

      request = $.ajax {
        dataType: 'json',
        data: post_data,
        url: action,
        type: "POST"
      }

      request.done (data)=>
        $(data.references).each (index,ref_hash)->
          window.Highliter.highlight(ref_hash.usfm,data.color)
        @triggerFormSuccess()