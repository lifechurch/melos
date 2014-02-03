window.Panes ?= {}

class window.Panes.Related extends window.Panes.Base

  constructor: (@params) ->
    super(@params)
    @template = $("#pane-related-tmpl")
    return

  render: ()->
    html = $(super())
    @afterRender(html)
    return html

  afterRender: (html)->
    html.on "click", (event)=>
      event.preventDefault();
      if html.hasClass("disabled")
        return
      else window.location.href = @related_path()
    return


  selected_version_id: ()->
    $("article.reader").data("version")

  selected_usfm: ()->
    reader = $("article.reader")
    book   = reader.data("book-api")
    chap   = reader.data("chapter")
    return book + "." + chap

  related_path: ()->
    "/moments/related?" + "v=" + @selected_version_id() + "&usfm=" + @selected_usfm()
