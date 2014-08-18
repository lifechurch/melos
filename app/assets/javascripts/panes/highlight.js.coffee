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
    @setupForm(html.find("form"))
    return

  defaultColor: ()->
    "fffe00"

  setupForm: (form)->
    $(form).on "submit", (event)=>
      event.preventDefault()

      # Named helper function to get form field values by name
      field_val = (name)->
        return form.find("[name='" + name + "']").val()

      post_data = {
        authenticity_token: field_val("authenticity_token"),
        highlight: {
          version_id:       field_val("highlight[version_id]"),
          usfm_references:  field_val("highlight[usfm_references]"),
          color:            field_val("highlight[color]") || @defaultColor
        }
      }

      request = $.ajax {
        url: @getLocale() + form.attr("action"),
        dataType: 'json',
        data: post_data,
        type: "POST"
      }

      request.done (data)=>
        @highlightVerses(data)
        @setupCommentLink(data)
        @showFormSuccess()

  resetForm: (form)->

    reset = (name)->
      form.find("[name='" + name + "']").val("")

    reset("highlight[usfm_references]")
    reset("highlight[color]")      