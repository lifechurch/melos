window.Menus ?= {}

class window.Menus.MenuGroup

  constructor: (@el)->
    @menus = []
    @current_menu = undefined
    #this.listener().bind "mousedown", $.proxy(this.handleDocumentMousedown,this)

  element: ->
    $(@el)

  listener: ->
    this.element()


  handleOpen: (event,data)->
    @current_menu.close() unless @current_menu == undefined
    @current_menu = data.target
    return


  handleClose: (event,data)->
    delete @current_menu
    return

  handleDocumentMousedown: (event)->
    el = $(event.target)
    return


  addMenu: (menu)->
    this.listener().unbind "yv:menu:open"
    this.listener().bind "yv:menu:open", this.handleOpen

    this.listener().unbind "yv:menu:close"
    this.listener().bind "yv:menu:close", this.handleClose

    @menus.push(menu)
    return