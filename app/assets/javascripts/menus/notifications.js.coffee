window.Menus ?= {}

class window.Menus.Notifications extends window.Menus.Base
  
  # Constructor
  # ------------------------------------------------------------

  constructor: (@trigger_el, @base_element) ->
    
    @base_element     = $(@base_element)
    @string_view_all  = @base_element.data("str-view-all")
    @string_none      = @base_element.data("str-none")

    @container        = @base_element.find(".popover-data-container")    
    @template         = JST["menus/notifications"]
    @api_url          = "/notifications.json?length=5"
    @popover          = $(@trigger_el).next('.header-popover')

    $(@trigger_el).click (e)=>
      e.preventDefault()
      if @isVisible() then @close() else @open()
      return


  # Load notifications via ajax
  # ------------------------------------------------------------

  load: ->
    # We store the data from a previous call, so if it's present, just show it.
    # Otherwise, make the AJAX call.
    if @data?
      @show()
    else
      request = $.ajax @api_url,
        type: "GET"
        dataType: "json"

      request.done (data) =>
        @data = data
        @show()
        return

    return


  # Present our data to the template and render it to our container.
  show: ()->
    $(@container).html(
      @template
        notifications: @data
        str_view_all:  @string_view_all
        str_none:      @string_none
    )
    Page.prototype.orientAndResize()
    return


  # Visibility of menu
  # ------------------------------------------------------------    

  isVisible: ->
    $(@trigger_el).hasClass("active")


  # Open menu & load notifications
  # ------------------------------------------------------------

  open: ->
    @popover.show().animate({'opacity' : '1'}, 200);
    @load()
    $(@trigger_el).addClass("active")
    Events.Emitter.emit "yv:menu:open", [{target: this}]
    return


  # Close menu
  # ------------------------------------------------------------

  close: ->
    @popover.animate({'opacity' : '0'}, 200, "swing", @popover.hide());
    $(@trigger_el).removeClass("active")
    Events.Emitter.emit "yv:menu:close", [{target: this}]
    return