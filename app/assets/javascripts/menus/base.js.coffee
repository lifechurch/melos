window.Menus ?= {}

class window.Menus.Base

  constructor: ->

  trigger: (event, args)->
    $.event.trigger(event, args)
    return