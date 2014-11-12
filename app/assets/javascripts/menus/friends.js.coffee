window.Menus ?= {}

class window.Menus.Friends extends window.Menus.Base
  # Constructor
  # ------------------------------------------------------------

  constructor: (@trigger_el, @base_element) ->
    super(@trigger_el,@base_element)

    @i18n = {
      wants_friendship: @base_element.data("str-wants-friendship"),
      accept:           @base_element.data("str-accept"),
      ignore:           @base_element.data("str-ignore"),
      no_requests:      @base_element.data("str-no-requests"),
      view_all:         @base_element.data("str-view-all"),
      none:             @base_element.data("str-none")
    }

    @container    = $(@base_element).find(".popover-data-container")
    @template     = JST["menus/friends"]
    @api_url      = "/friendships/requests.json"
    @popover      = $(@trigger_el).next('.header-popover')
    @badge        = $('.friend-request-count')
    @preload()

    # Listen for a specific event to open this menu (moment intro page)
    Events.Emitter.addListener "menu:friend-requests:open", $.proxy(@open,@)
    Events.Emitter.addListener "menu:friend-requests:close", $.proxy(@close,@)


  preload: ->
    request = $.ajax @api_url,
        type: "GET"
        dataType: "json"

    request.done (data) =>
      @data = data
      @setupBadge()

  setupBadge: ->
    if @data && @data.incoming && @data.incoming.length
      @badge.html(@data.incoming.length)
      @badge.show()

  load: ->
    if @data?
      @show()
    else
      request = $.ajax @api_url,
        type: "GET"
        dataType: "json"

      request.done (data) =>
        @data = data
        @show()

  show: ()->
    $(@container).html(@template({requests: @data, i18n: @i18n}))
    Page.prototype.orientAndResize()


  open: ->
    super
    @popover.show().animate({'opacity' : '1'}, 200);
    @load()

  close: ->
    super
    @popover.animate({'opacity' : '0'}, 200, "swing", @popover.hide());
