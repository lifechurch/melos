import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import Slider from 'react-slick'
import CarouselSlideTitle from './CarouselSlideTitle'
import CarouselArrow from './CarouselArrow'


function CarouselTitle(props) {
	const { carouselContent, localizedLink, isRtl } = props

	const settings = {
		centerMode: false,
		infinite: true,
		variableWidth: true,
		slidesToScroll: 3,
		rtl: isRtl(),
		prevArrow: <CarouselArrow dir='left' width={20} height={20} fill='gray' backColor='whitesmoke' />,
		nextArrow: <CarouselArrow dir='right' width={20} height={20} fill='gray' backColor='whitesmoke' />,
		responsive: [ {
			breakpoint: 524, settings: { arrows: false, slidesToScroll: 2 }
		} ]
	};

	const slideStyle = isRtl() ? { display: 'inline-block' } : {}
	const slides = carouselContent.items.map((slide) => {
		return (
			<div className='slide' key={slide.id} style={slideStyle}>
				<Link to={localizedLink(`/reading-plans-collection/${slide.id}`)}>
					<CarouselSlideTitle id={slide.id} title={slide.title} />
				</Link>
			</div>
		)
	})

	const classes = 'carousel-title'
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
				<div style={innerStyle}>{ slides }</div>
			</div>
		)
	} else {
		slider = <Slider {...settings}>{slides}</Slider>
	}

	return (
		<div className={classes}>
			{ slider }
		</div>
	)
}

CarouselTitle.propTypes = {
	carouselContent: PropTypes.object.isRequired,
	localizedLink: PropTypes.func.isRequired,
	isRtl: PropTypes.func.isRequired,
}

export default CarouselTitle
