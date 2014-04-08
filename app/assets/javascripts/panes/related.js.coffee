window.Panes ?= {}

class window.Panes.Related extends window.Panes.Base

  constructor: (@params) ->
    super(@params)
    @trigger_el.on "click", ()=>
      window.location.href = @relatedPath()
    return

  selected_version_id: ()->
    $("article.reader").data("version")

  selected_usfm: ()->
    reader = $("article.reader")
    book   = reader.data("book-api")
    chap   = reader.data("chapter")
    return book + "." + chap

  relatedPath: ()->
    "/moments/related?" + "v=" + @selected_version_id() + "&usfm=" + @selected_usfm()
