class window.Scroll

  @toVerse: (verse)->
    verse       = $(verse || $('#version_primary .selected:first'))
    easingType  = 'easeInOutCirc'
    duration    = 1200

    if verse?
      article = $('article')
      newPosition = (verse.offset().top - article.offset().top + article.scrollTop() - parseInt(verse.css('line-height'), 10)/4) - 30;
      if app.getPage().MODERN_BROWSER
        $('html:not(:animated),body:not(:animated)').animate {scrollTop: newPosition }, {easing: easingType, duration: duration}
      else
        $(window).scrollTop(newPosition)