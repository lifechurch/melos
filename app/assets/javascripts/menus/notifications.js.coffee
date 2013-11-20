window.Menus ?= {}

class window.Menus.Notifications extends window.Menus.Base
  
  # Constructor
  # ------------------------------------------------------------

  constructor: (@trigger_el, @base_element) ->
    
    @container = $(@base_element).find(".popover-data-container")
    @template = $("#notifications-tmpl")
    @api_url  = "/notifications.json?length=5"
    @popover  = $(@trigger_el).next('.header-popover')

    $(@trigger_el).click (e)=>
      e.preventDefault()

      if this.isVisible()
         this.close()
      else
         this.open()
      
      return


  # Load notifications via ajax
  # ------------------------------------------------------------

  load: ->
    request = $.ajax @api_url,
      type: "GET"
      dataType: "json"

    request.done (data) =>
      template = Handlebars.compile(@template.html())
      $(@container).html(template({notifications: data}))
      return

    request.fail (jqXHR,status) =>
      alert "Failed friend request" + status

    return


  # Visibility of menu
  # ------------------------------------------------------------    

  isVisible: ->
    $(@trigger_el).hasClass("active")


  # Open menu & load notifications
  # ------------------------------------------------------------

  open: ->
    @popover.show().animate({'opacity' : '1'}, 200);
    this.load()
    $(@trigger_el).addClass("active")
    this.trigger("yv:menu:open", {target: this})
    return


  # Close menu
  # ------------------------------------------------------------

  close: ->
    @popover.animate({'opacity' : '0'}, 200);
    $(@trigger_el).removeClass("active")
    this.trigger("yv:menu:close",{target: this})
    return