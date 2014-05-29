class window.Highliter

  @highlight: (refs_array,color)->
    $.each refs_array, (idx,ref)->
      reader_verse = $("span[data-usfm='" + ref + "']")
      reader_verse.addClass("highlighted")
      reader_verse.attr("data-highlight-color", "#" + color) if color?
      reader_verse.css('background-color', "#" + color) if color?
      reader_verse.addClass("dark_bg") if color? and Highliter.isColorDark(color)
    return

  @isColorDark: (hex_color)->
    # Using same code as android for this algorithm - EP
    # perform math for WCAG1
    brightnessThreshold = 125
    colorThreshold = 500

    # testing FG white
    fr = 255
    fg = 255
    fb = 255

    # hex color as RGB
    br = parseInt(hex_color.substring(0, 2), 16)
    bg = parseInt(hex_color.substring(2, 4), 16)
    bb = parseInt(hex_color.substring(4, 6), 16)

    bY= ((br * 299) + (bg * 587) + (bb * 114)) / 1000
    fY= ((255 * 299) + (255 * 587) + (255 * 114)) / 1000
    
    brightnessDifference = Math.abs(bY-fY)
    colorDifference = (Math.max(fr, br) - Math.min(fr, br)) + (Math.max(fg, bg) - Math.min(fg, bg)) + (Math.max(fb, bb) - Math.min(fb, bb))

    return brightnessDifference >= brightnessThreshold or colorDifference >= colorThreshold