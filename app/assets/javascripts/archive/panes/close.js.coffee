window.Panes ?= {}

class window.Panes.Close extends window.Panes.Base

  constructor: (@params) ->
    super(@params)
    @trigger_el.on "click", (event)=>
      event.preventDefault()
      Events.Emitter.emit("panes:cleared")
    return