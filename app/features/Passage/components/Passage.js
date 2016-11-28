import React, { Component, PropTypes } from 'react'
import VerseCard from '../../Bible/components/verseAction/bookmark/VerseCard'
import Carousel from '../../../components/Carousel/Carousel'
import CarouselArrow from '../../../components/Carousel/CarouselArrow'
import Slider from 'react-slick'

class Passage extends Component {

	render() {
		const { auth, passage, isRtl, localizedLink } = this.props

		let mainVerse, versesCarousel, plansCarousel, slider = null
    let settings = {
      centerMode: false,
      infinite: true,
      variableWidth: true,
      slidesToScroll: 2,
      rtl: isRtl(),
      prevArrow: <CarouselArrow dir='left' width={25} height={25} backColor='black'/>,
      nextArrow: <CarouselArrow dir='right' width={25} height={25} backColor='black'/>,
      responsive: [ {
        breakpoint: 524, settings: { arrows: false }
      } ]
    }
		let slides = []
		if (passage && passage.verses && passage.verses.verses) {
			Object.keys(passage.verses.verses).forEach((key, index) => {
				let verse = { [key]: passage.verses.verses[key] }
				if (index == 0) {
					mainVerse = <VerseCard verses={verse} />
				} else {
					slides.push(
						<div key={key} >
							<VerseCard verses={verse} />
						</div>
					)
				}
			})
		}
		if (slides.length > 0) {
			slider = <div className='carousel-gradient' ><Slider {...settings}>{slides}</Slider></div>
		}

		return (
			<div className=''>
				<div className='row main-content'>
					<div className='title'>{ passage.verses.title }</div>
					<div className='single-verse'>
						{ mainVerse }
					</div>
					<a className='chapter-button solid-button'>Read Full Chapter</a>
				</div>
				<div className='verses-carousel'>
					{ slider }
				</div>
				<div className='related-plans'>
					<Carousel carouselType='standard' imageConfig={passage.configuration.images} carouselContent={passage.readingPlans} isRtl={isRtl} localizedLink={localizedLink}/>
				</div>
			</div>
		)
	}
}


/**
 *
 */
Passage.propTypes = {

}

export default Passage