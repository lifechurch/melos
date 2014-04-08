window.Menus ?= {}

class window.Menus.Base

  constructor: (@trigger_el, @base_element)->
    @base_element = $(@base_element)

    $(@trigger_el).click (e)=>
      e.preventDefault()
      if @isVisible() then @close() else @open()      
      return

  isVisible: ->
    $(@trigger_el).hasClass("active")


  open: ->
    $(@trigger_el).addClass("active")
    Events.Emitter.emit "yv:menu:open", [{target: this}]
    return


  close: ->
    $(@trigger_el).removeClass("active")
    Events.Emitter.emit "yv:menu:close", [{target: this}]
    return