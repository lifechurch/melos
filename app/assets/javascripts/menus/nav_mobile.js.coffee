window.Menus ?= {}

class window.Menus.NavMobile extends window.Menus.Base
  # Constructor
  # ------------------------------------------------------------

  constructor: (@trigger_el, @base_element) ->
    
    @container = $(@base_element).find("nav")

    $(@trigger_el).click (e)=>
      e.preventDefault()

      if this.isVisible()
         this.close()
      else
         this.open()
      return

  # Visibility of menu
  # ------------------------------------------------------------    

  isVisible: ->
    $(@trigger_el).hasClass("active")
    

  # Open menu
  # ------------------------------------------------------------

  open: ->
    $(@container).slideDown();
    $(@base_element).css("max-height", $("body").height() - $("#header").height() + "px");
    $(@trigger_el).addClass("active")
    this.trigger("yv:menu:open", {target: this})
    return


  # Close menu
  # ------------------------------------------------------------

  close: ->
    $(@container).slideUp();
    $(@trigger_el).removeClass("active")
    this.trigger("yv:menu:close",{target: this})
    return