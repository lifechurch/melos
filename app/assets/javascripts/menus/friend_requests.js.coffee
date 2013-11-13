window.Menus ?= {}

class window.Menus.FriendRequests extends window.Menus.Base
  # Constructor
  # ------------------------------------------------------------

  constructor: (@trigger_el, @base_element) ->
    
    @api_url    = "/friendships/requests.json"
    @template   = $("#friend-requests-tmpl")
    
    @popover    = $(@trigger_el).next('.header-popover')


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
      $(@base_element).html(template(data))
      this.addClickHandlers()
      return

    request.fail (jqXHR,status) =>
      alert "Failed friend request" + status

    return
    

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


  addClickHandlers: ->

    @add_btns    = @popover.find(".action-add")
    @ignore_btns = @popover.find(".action-ignore")

    console.log(@add_btns)
    console.log(@remove_btns)

    @add_btns.on "click", (e)=>
      e.preventDefault()
      this.add($(e.currentTarget).data("user-id"))
      return

    @ignore_btns.on "click", (e)=>
      e.preventDefault()
      this.ignore($(e.currentTarget).data("user-id"))
      return

  # Add friend
  # ------------------------------------------------------------

  add: (user_id)->
    console.log("adding: " + user_id)
    return

  # Remove friend
  # ------------------------------------------------------------

  ignore: (user_id)->
    console.log("removing: " + user_id)
    return