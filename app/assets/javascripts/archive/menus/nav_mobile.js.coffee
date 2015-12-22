window.Menus ?= {}

class window.Menus.NavMobile extends window.Menus.Base
  # Constructor
  # ------------------------------------------------------------

  constructor: (@trigger_el, @base_element) ->
    super(@trigger_el,@base_element)
    @container = $(@base_element).find("nav")
    return


  open: ->
    super
    @container.slideDown();
    $(@base_element).css("max-height", $("body").height() - $("#header").height() + "px");
    
    return


  close: ->
    super
    @container.slideUp();
    
    return