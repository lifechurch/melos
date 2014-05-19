window.Panes ?= {}

class window.Panes.Bookmark extends window.Panes.Base

  constructor: (@params) ->
    super(@params)
    @template = $("#pane-bookmark-tmpl")

  render: ()->
    html = $(super())
    @afterRender(html)
    return html


  afterRender: (html)->
    super(html)
    @setupColorpicker()
    @setupForm(html.find("form"))
    @setupBookmarkLabels() if Session.User.isLoggedIn()
    

  setupForm: (form)->
    $(form).on "submit", (event)=>
      event.preventDefault()

      # Named helper function to get form field values by name
      field_val = (name)->
        return form.find("[name='" + name + "']").val()

      post_data = {
        authenticity_token: field_val("authenticity_token"),
        bookmark: {
          version_id:       field_val("bookmark[version_id]"),
          usfm_references:  field_val("bookmark[usfm_references]"),
          color:            field_val("bookmark[color]"),
          title:            field_val("bookmark[title]"),
          labels:           field_val("bookmark[labels]")
        }
      }

      request = $.ajax {
        url: form.attr("action"),
        dataType: 'json',
        data: post_data,
        type: "POST"
      }

      request.done (data)=>
        @highlightBookmark(data)
        @setupCommentLink(data)
        @showFormSuccess()


  resetForm: (form)->

    reset = (name)->
      form.find("[name='" + name + "']").val("")

    reset("bookmark[usfm_references]")
    reset("bookmark[color]")
    reset("bookmark[title]")
    reset("bookmark[labels]")

  highlightBookmark: (data)->
    if data.color?
      $(data.references).each (index,ref_hash)->
      window.Highliter.highlight(ref_hash.usfm,data.color)

  setupBookmarkLabels: ()->
    field = $("#bookmark_labels")
    # Grab our colors via ajax
    labels_request = $.ajax
      type: "GET",
      dataType: "json",
      url: "/bookmarks/labels"

    labels = []
    # Upon successful ajax, append the response to our html template
    labels_request.done (data) =>

      split = (val)->
        val.split( /,\s*/ )

      extractLast = (term)->
        split(term).pop()

      $(data).each (index,obj)->
        labels.push obj.label

      label_field = $("#bookmark_labels")
      label_field.on "keydown", (event)->
        if event.keyCode == $.ui.keyCode.TAB && $(event.currentTarget).data( "ui-autocomplete" ).menu.active
           event.preventDefault()

      label_field.autocomplete {
        minLength: 0,
        source: (request,response)->
          response($.ui.autocomplete.filter(labels,extractLast(request.term)))
        ,
        focus: ()->
          return false
        ,
        select: (event,ui)->
          field = $(event.currentTarget)
          terms = split(label_field.val())
          terms.pop()
          terms.push(ui.item.value)
          terms.push("")
          label_field.val(terms.join(", "))
          return false
      }

