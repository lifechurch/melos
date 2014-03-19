window.Menus ?= {}

class window.Menus.FriendRequests extends window.Menus.Base
  # Constructor
  # ------------------------------------------------------------

  constructor: (@trigger_el, @base_element) ->
    
    @container = $(@base_element).find(".popover-data-container")
    @api_url    = "/friendships/requests.json"
    @template   = $("#friend-requests-tmpl")
    @popover    = $(@trigger_el).next('.header-popover')

    # Listen for a specific event to open this menu (moment intro page)
    Events.Emitter.addListener "menu:friend-requests:open", $.proxy(@open,@)
    Events.Emitter.addListener "menu:friend-requests:close", $.proxy(@close,@)

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



  load: ->
    request = $.ajax @api_url,
      type: "GET"
      dataType: "json"

    request.done (data) =>
      template = Handlebars.compile(@template.html())
      $(@container).html(template(data))
      Page.prototype.orientAndResize()
      return

    return
    

  # Open menu & load notifications
  # ------------------------------------------------------------

  open: ->
    @popover.show().animate({'opacity' : '1'}, 200);
    this.load()
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