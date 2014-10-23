window.Moments ?= {}

class window.Moments.ReadingPlanCarousel extends window.Moments.Base

  constructor: (@data, @feed)->
    @template = JST["moments/reading_plan_carousel"]
    @uuid = @generateID()
    @feed.ready(@)

  render: ()->
    if @template
      html = @template
        kind:           @data.kind
        category:       @data.category
        plans:          @data.plans
        uuid:           @uuid
        moment_title:   @data.moment_title
        avatar:         @data.avatar
        avatar_style:   @data.avatar_style
      return html

  initInteractions: ()->
    $('.featured-rp-box').first().slick
      centerMode: true
      centerPadding: "0"
      slidesToShow: 3
      infinite: true
      variableWidth: true
      responsive: [
        {
          breakpoint: 768
          settings:
            arrows: false
            centerMode: true
            centerPadding: "10px"
            slidesToShow: 1
        }
      ]

