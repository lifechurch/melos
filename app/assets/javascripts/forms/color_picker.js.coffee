window.Forms ?= {}

class window.Forms.ColorPicker

  constructor: (form)->
    @form_el = $(form)
    @setupColorpicker()
    return

  setupColorpicker: ()->

    picker_list     = @form_el.find(".color_picker_list")
    current_color   = picker_list.data("current-color")

    # Grab our colors via ajax
    colors_request = $.ajax
      type: "GET",
      dataType: "json",
      url: "/highlights/colors"

    # Upon successful ajax, append the response to our html template
    colors_request.done (data) =>
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
