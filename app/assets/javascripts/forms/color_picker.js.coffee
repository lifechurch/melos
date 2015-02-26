window.Forms ?= {}

class window.Forms.ColorPicker

  constructor: (form)->
    @form_el = $(form)
    @setupColorpicker() if Session.User.isLoggedIn()
    return

  storeColorsInSession: (colors)->
    if typeof(localStorage) != "undefined"
      sessionStorage.setItem("colors", JSON.stringify(colors))

  fetchColorsFromSession: ()->
    if typeof(localStorage) != "undefined"
      return JSON.parse(sessionStorage.getItem("colors"))
    else
      return null

  setupColorpicker: ()->
    # Try to get colors from browser session storage
    colors = @fetchColorsFromSession()

    # Colors weren't in browser session storage
    if !colors
      # Put a placeholder in session storage while we wait for ajax call
      @storeColorsInSession('placeholder')
      colors_request = $.ajax
        type: "GET",
        dataType: "json",
        url: "/highlights/colors"

      # Upon successful ajax, append the response to our html template
      #  and fire event for all other instances of this class
      colors_request.done (data) =>
        @storeColorsInSession(data)
        Events.Emitter.emit "colors:ready", [{data: data}]
        @handleColorsResponse(data)

    # Another instance has requested colors so wire up an event listener
    #  and wait on that instance to finish and fire event
    else if colors == 'placeholder'
      that = @
      Events.Emitter.addListener "colors:ready", (eventData)->
        that.handleColorsResponse(eventData.data)

    # Hey! We found it in browser session storage
    else
      @handleColorsResponse(colors)

  # Handle response in separate method because
  #  data could come from event or from ajax call
  handleColorsResponse: (data)->
    picker_list     = @form_el.find(".color_picker_list")
    current_color   = picker_list.data("current-color")

    buttons_html = ""

    data.forEach (hex,index)->
      id            = "highlight_" + hex

      if hex == current_color
        buttons_html += "<div class='color' id='" + id + "' data-color-hex='" + hex + "' style='background-color: #" + hex + "'><span>✓</span></div>"
      else
        buttons_html += "<div class='color' id='" + id + "' data-color-hex='" + hex + "' style='background-color: #" + hex + "'></div>"

    picker_list.append(buttons_html)

    # Setup click handlers on color buttons
    picker_list.find(".color").each (i,element)=>
      @setupColorClickListener(element)

    color_picker = @form_el.find(".color_picker")

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

        button    = @form_el.find("#" + id)
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
