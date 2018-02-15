import React from 'react'
import PropTypes from 'prop-types'
import Slider from 'react-slick'
import { Link } from 'react-router'
import CarouselSlideGradient from './CarouselSlideGradient'
import CarouselArrow from './CarouselArrow'


function CarouselGradient(props) {
	const { carouselContent, localizedLink, isRtl } = props

	const settings = {
		centerMode: false,
		infinite: true,
		variableWidth: true,
		slidesToScroll: 2,
		rtl: isRtl(),
		prevArrow: <CarouselArrow dir='left' width={25} height={25} backColor='black' />,
		nextArrow: <CarouselArrow dir='right' width={25} height={25} backColor='black' />,
		responsive: [ {
			breakpoint: 524, settings: { arrows: false, slidesToScroll: 1 }
		} ]
	}

	const slideStyle = isRtl() ? { display: 'inline-block' } : {}

	const slides = carouselContent.items.map((slide) => {
		return (
			<div className='radius-3' key={slide.id} style={slideStyle}>
				<Link to={localizedLink(`/reading-plans-collection/${slide.id}-${slide.slug}`)}>
					<CarouselSlideGradient gradient={slide.gradient} id={slide.id} title={slide.title} />
				</Link>
			</div>
		)
	})

	const classes = 'carousel-gradient'
	let slider = null
	if (isRtl()) {
		const outerStyle = {
			width: '100%',
			overflowX: 'scroll'
		}
		const innerStyle = {
			width: 10000
		}

		slider = (
			<div className='rtl-faux-slider' style={outerStyle}>
				<div style={innerStyle}>
					{ slides }
				</div>
			</div>
		)
	} else {
		slider = <Slider {...settings}>{slides}</Slider>
	}

	return (
		<div className={classes} >
			{ slider }
		</div>
	)
}

CarouselGradient.propTypes = {
	carouselContent: PropTypes.object.isRequired,
	localizedLink: PropTypes.func.isRequired,
	isRtl: PropTypes.func.isRequired,
}

export default CarouselGradient
