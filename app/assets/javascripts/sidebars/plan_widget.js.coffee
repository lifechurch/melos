class window.PlanWidget

  @toDay: (day)->
    week = day / 7
    week = 1 if day <=1
    easingType  = 'easeInOutCirc'
    duration    = 1200
    container = $('.calendar-cal')  
    day_width = $('.calendar-cal-days').first().width()


    if week?
      newPosition = (week * day_width + 1);
      if app.getPage().MODERN_BROWSER
        container.animate {scrollLeft: newPosition }, {easing: easingType, duration: duration}
      else
        container.scrollLeft(newPosition)