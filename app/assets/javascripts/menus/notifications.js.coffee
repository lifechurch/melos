window.Menus ?= {}

class window.Menus.Notifications extends window.Menus.Base
  
  # Constructor
  # ------------------------------------------------------------

  constructor: (@trigger_el, @base_element) ->
    super(@trigger_el,@base_element)
    
    @i18n = {
      no_notifications: @base_element.data("str-no-notifications")
      view_all: @base_element.data("str-view-all")
      none: @base_element.data("str-none")
    }

    @container        = @base_element.find(".popover-data-container")    
    @template         = JST["menus/notifications"]
    @api_url         = "/notifications"
    @popover          = $(@trigger_el).next('.header-popover')
    @badge            = $('.notifications-count')
    @preload()

  preload: ->
    request = $.ajax 
        url: @api_url
        type: "GET"
        dataType: "json"
        data:
          length: 5

    request.done (data) =>
      @data = data
      @setupBadge(@data)

  setupBadge: ->
    if @data && @data[0]
      unless @data[0].attributes.new_count == 0
        @badge.html(@data[0].attributes.new_count)
        @badge.css('display', 'inline-block');
        
 
  load: ->
    # We store the data from a previous call, so if it's present, just show it.
    # Otherwise, make the AJAX call.
    if @data?
      @show()
    else
      request = $.ajax 
        url: @api_url
        type: "GET"
        dataType: "json"
        data:
          length: 5


      request.done (data) =>
        @data = data
        @show

  readNotifications: ->
    request = $.ajax
      url: @api_url
      type: "DELETE"
      dataType: "json"

    request.done (data) =>
      @badge.html("0")
      @badge.hide()

  # Present our data to the template and render it to our container.
  show: ()->
    $(@container).html(
      @template
        notifications: @data
        i18n: @i18n
    )
    Page.prototype.orientAndResize()


  open: ->
    super
    @popover.show().animate({'opacity' : '1'}, 200);
    @readNotifications()
    @load()

  close: ->
    super
    @popover.animate({'opacity' : '0'}, 200, "swing", @popover.hide());
