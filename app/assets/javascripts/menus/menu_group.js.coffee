window.Menus ?= {}

class window.Menus.MenuGroup

  constructor: (@el)->
    @menus = []
    @current_menu = undefined
    Events.Emitter.addListener "yv:menu:open", $.proxy(@handleOpen,@)
    Events.Emitter.addListener "yv:menu:close", $.proxy(@handleClose,@)

    #this.listener().bind "mousedown", $.proxy(this.handleDocumentMousedown,this)

  element: ->
    $(@el)

  listener: ->
    this.element()

  handleOpen: (data)->
    @current_menu.close() unless @current_menu == undefined
    @current_menu = data.target
    return


  handleClose: (data)->
    delete @current_menu
    return

  handleDocumentMousedown: (event)->
    el = $(event.target)
    return

  addMenu: (menu)->
    @menus.push(menu)
    return