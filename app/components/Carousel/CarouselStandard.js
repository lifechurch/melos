import React, { Component } from 'react'
import Slider from 'react-slick'
import CarouselSlideGradient from './CarouselSlideGradient'
import CarouselSlideImage from './CarouselSlideImage'
import Image from './Image'
import CarouselArrow from './CarouselArrow'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router'

class CarouselStandard extends Component {

  render() {
		const { carouselContent, imageConfig, localizedLink, context, isRtl } = this.props

		var carouselTitle = (carouselContent.title) ? carouselContent.title : <FormattedMessage id='plans.related plans' />
		// for a dynamic collection we need to build, the header link will be different
		var carouselLink = (context == 'recommended') ? `/recommended-plans-collection/${carouselContent.id}` : (context == 'saved') ? `/saved-plans-collection` : `/reading-plans-collection/${carouselContent.id}`

		const slideStyle = isRtl() ? { display: 'inline-block' } : {}

    var settings = {
			centerMode: false,
      infinite: false,
      variableWidth: true,
      slidesToScroll: 2,
      slidesToShow: 2,
      arrows: true,
      rtl: isRtl(),
      prevArrow: <CarouselArrow dir='left' fill='gray' width={19} height={19}/>,
      nextArrow: <CarouselArrow dir='right' fill='gray' width={19} height={19}/>,
      responsive: [ {
      	breakpoint: 524, settings: { arrows: false, slidesToShow: 1, slidesToScroll: 1 }
      } ]
		}

    // we want an image first, if that doesn't exist then we go to gradient, if gradient doesn't exist then just set default plan image
    var slides = carouselContent.items.map( function(slide, index) {

    	var slideLink = (slide.type == 'collection') ? localizedLink(`/reading-plans-collection/${slide.id}-${slide.slug}`) : localizedLink(`/reading-plans/${slide.id}-${slide.slug}`)

    	if (slide.image_id) {
				return (
					<div className='radius-5' key={index} style={slideStyle}>
						<Link to={slideLink}>
							<CarouselSlideImage title={slide.title}>
	    					<Image width={320} height={180} thumbnail={false} imageId={slide.image_id} type={slide.type} config={imageConfig} />
	    				</CarouselSlideImage>
    				</Link>
					</div>
				)
			} else if (slide.gradient) {
				return (
					<div className='radius-5' style={slideStyle}>
						<Link to={slideLink}>
							<CarouselSlideGradient gradient={slide.gradient} id={slide.id} title={slide.title}/>
						</Link>
					</div>
				)
			} else {
				return (
					<div className='radius-5' key={index} style={slideStyle}>
						<Link to={slideLink}>
							<CarouselSlideImage title={slide.title} >
								<Image width={320} height={180} thumbnail={false} imageId='default' type={slide.type} config={imageConfig} />
							</CarouselSlideImage>
						</Link>
					</div>
				)
			}
    })

		let slider = null

		if (isRtl()) {

			const outerStyle = {
				width: "100%",
				overflowX: "scroll"
			}

			const innerStyle = {
				width: 10000
			}

			slider = <div className='rtl-faux-slider' style={outerStyle}><div style={innerStyle}>{slides}</div></div>
		} else {
			slider = <Slider {...settings}>{slides}</Slider>
		}

	  return (
	    <div className='carousel-standard' >
	    	<Link className='carousel-header' to={localizedLink( carouselLink )}>
	    		<div className='title'>{ carouselTitle }</div>
	    		<div className='see-all'><FormattedMessage id="plans.see all" /></div>
	    		<CarouselArrow width={19} height={19} fill='gray'/>
	    	</Link>
	    	{slider}
	    </div>
	  );
	}
}


export default CarouselStandard
