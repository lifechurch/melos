window.Panes ?= {}

class window.Panes.Base

  constructor: (@params)->
    @el               = $(@params.el)
    @form_el          = @el.find("form")
    @references_field = @el.find(".verses_selected_input")

  # Some panes have a form with references field that we need
  # to update whenever clicks happen in the reader
  updateForm: (data) ->
    refs = data.references || [];
    @references_field.val refs.join("+") # populate hidden field
    return


  # Get the pane element, in this case a <dd> from the template.
  pane: ()->
    if @pane_el? then return @pane_el else return @el

  # We can set this Pane instances pane element to a different element
  # Currently being used for showing registration pane when a user isn't logged in
  setPane: (pane)->
    @pane_el = pane
    return

  # Compile our template via Handlebars, and render to html
  render: ()->
    if @template
      t = Handlebars.compile @template.html()
      html = t()
      return html

  # After render needs to be manually called at the moment.
  # Usually called from implementation class that overrides 
  # #render and #afterRender methods.
  afterRender: (html)->
    # siblings because html is a 2 node fragment, rather than a container
    fragment          = $(html)
    @el               = fragment.siblings(@params.el)
    @trigger_el       = fragment.siblings("dt")
    @form_el          = @el.find("form")
    @references_field = @el.find(".verses_selected_input")

    @setupClickHandlers()
    return

  setupClickHandlers: ()->
    if @trigger_el.length
      @trigger_el.click (event)=>
        if @trigger_el.hasClass("active")
          @trigger("pane:close", {pane: @})
        else
          @trigger("pane:open", {pane: @})

  # Show the pane <dd>
  open: (complete)->
    @showRegistrationInfo() unless @isLoggedIn()
    @trigger_el.addClass("active")
    @pane().slideDown 250, complete

  # Hide the pane <dd>
  close: (complete)->
    @trigger_el.removeClass("active")
    @pane().slideUp 250, complete

  # Customize registration pane if logged in
  showRegistrationInfo: ()->
    @pane().find(".blurbs p").hide()
    @pane().find('.blurbs p.' + @trigger_el.data("pane-type")).show()

  # Utility / convenience method for checking a users logged in status
  isLoggedIn: ()->
    return $("html").data("logged-in")

  # Utility method to trigger a jQuery event.
  trigger: (event, args)->
    $.event.trigger(event, args)
    return

  setupColorpicker: ()->

    # Grab our colors via ajax
    colors_request = $.ajax
      type: "GET",
      dataType: "json",
      url: "/highlights/colors"

    picker_list     = @form_el.find(".color_picker_list")
    # Upon successful ajax, append the response to our html template
    colors_request.done (data) =>
      buttons_html = ""
      
      data.forEach (hex,index)->
        id            = "highlight_" + hex
        buttons_html += "<div class='color' id='" + id + "' data-color-hex='" + hex + "' style='background-color: #" + hex + "'></div>"

      picker_list.append(buttons_html)

      # Setup click handlers on color buttons
      picker_list.find(".color").each (i,element)=>
        @setupColorClickListener(element)

      color_picker = @el.find(".color_picker")

      color_picker.ColorPicker({
        flat: false,
        onChange: (hsb,hex,rgb,el)->
          $(".colorpicker_hex").css('background-color', "#" + hex)
        ,
        onSubmit: (hsb,hex,rgb,el)=>
          id        = "highlight_" + hex
          btn_html = $("<div/>",{
            id: id,
            class: "color",
            "data-color-hex": hex,
            style: "background-color: #" + hex,
          })

          picker_list.append(btn_html)

          @setupColorClickListener(btn_html)
          @colorClickHandler(btn_html)

          button    = @el.find("#" + id)
          button.css('background-color', '#' + hex)

          $(el).ColorPickerHide()
      })
    return

  setupColorClickListener: (target)->
    $(target).on "click", (event)=>
      @colorClickHandler $(event.currentTarget)

  colorClickHandler: (target)->
    color_field     = @form_el.find(".selected-color")
    # empty all color divs of any checkmarks
    target.siblings().html("")
    # toggle target state
    if target.children().length
      color_field.removeAttr("value")
      target.html("")
    else
      color_field.attr("value",target.data("color-hex"))
      target.append("<span>✓</span>")
