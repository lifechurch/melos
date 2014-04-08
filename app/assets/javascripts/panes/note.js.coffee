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
    @setupForm(html.find("form"))

  setupForm: (form)->
    $(form).on "submit", (event)=>
      event.preventDefault()

      # Named helper function to get form field values by name
      field_val = (name)->
        return form.find("[name='" + name + "']").val()

      post_data = {
        authenticity_token: field_val("authenticity_token"),
        note: {
          version_id:       field_val("note[version_id]"),
          usfm_references:  field_val("note[usfm_references]"),
          color:            field_val("note[color]"),
          title:            field_val("note[title]"),
          user_status:      field_val("note[user_status]"),
          content:          field_val("note[content]")
        }
      }

      request = $.ajax {
        url: form.attr("action"),
        dataType: 'json',
        data: post_data,
        type: "POST"
      }

      request.done (data)=>
        if data.color?
          $(data.references).each (index,ref_hash)->
            window.Highliter.highlight(ref_hash.usfm,data.color)
        @showFormSuccess()


  resetForm: (form)->

    reset = (name)->
      form.find("[name='" + name + "']").val("")

    reset("note[usfm_references]")
    reset("note[color]")
    reset("note[title]")
    reset("note[user_status]")
    reset("note[content]")