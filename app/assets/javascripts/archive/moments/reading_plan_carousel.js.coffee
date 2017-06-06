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
        created_dt:     @data.created_dt
      return html

  initInteractions: ()->
    $('.featured-rp-box').slick
      centerMode: true
      centerPadding: "0px"
      slidesToShow: 1
      infinite: false
      variableWidth: true
      responsive: [
        {
          breakpoint: 768
          settings:
            arrows: false
            centerPadding: "10px"
            slidesToShow: 1
        }
      ]

