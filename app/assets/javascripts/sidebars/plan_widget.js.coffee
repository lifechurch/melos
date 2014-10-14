class window.PlanWidget

  @toNext: ->
    day_width = $('.calendar-cal-day').first().width()
    offset = $('.calendar-cal').scrollLeft()
    newPosition = ( 7 * day_width + offset)
    PlanWidget.toPosition(newPosition)

  @toPrev: ->
    day_width = $('.calendar-cal-day').first().width()
    offset = $('.calendar-cal').scrollLeft()
    newPosition = ( offset - ( 7 * day_width) )
    PlanWidget.toPosition(newPosition)

  @toPosition: (newPosition) ->
    easingType  = 'easeInOutCirc'
    duration    = 500
    if app.getPage().MODERN_BROWSER
      $('.calendar-cal').animate {scrollLeft: newPosition }, {easing: easingType, duration: duration}
    else
      $('.calendar-cal').scrollLeft(newPosition)

  @initialScroll: ->
    console.log("init");
    selected = $('.calendar-cal').find('.selected').parent()
    current = $('.calendar-cal').find('.current').parent()
    day_width = $('.calendar-cal-day').first().width()
    if selected
      PlanWidget.toPosition(selected.position().left - day_width + 4)
    else if current
      PlanWidget.toPosition(current.position().left - day_width + 4)