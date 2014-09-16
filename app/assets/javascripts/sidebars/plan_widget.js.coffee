class window.PlanWidget

  @toNext: ->
    container = $('.calendar-cal')  
    day_width = $('.calendar-cal-day').first().width()
    offset = container.scrollLeft()
    newPosition = ( 7 * day_width + offset)
    PlanWidget.toPosition(newPosition, container)

  @toPrev: ->
    container = $('.calendar-cal')  
    day_width = $('.calendar-cal-day').first().width()
    offset = container.scrollLeft()
    newPosition = ( offset - ( 7 * day_width) )
    PlanWidget.toPosition(newPosition, container)

  @toPosition: (newPosition, container) ->
    easingType  = 'easeInOutCirc'
    duration    = 900
    if app.getPage().MODERN_BROWSER
      container.animate {scrollLeft: newPosition }, {easing: easingType, duration: duration}
    else
      container.scrollLeft(newPosition)

  @initialScroll: ->
    container = $('.calendar-cal')
    selected = container.find('.selected').parent()
    day_width = $('.calendar-cal-day').first().width()
    if selected
      PlanWidget.toPosition(selected.position().left - day_width + 4, container)