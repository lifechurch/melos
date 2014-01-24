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
    @setupBookmarkLabels() if @isLoggedIn()
    

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

