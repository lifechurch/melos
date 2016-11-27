import React, { Component, PropTypes } from 'react'
import VerseCard from '../../Bible/components/verseAction/bookmark/VerseCard'
import Carousel from '../../../components/Carousel/Carousel'

class Passage extends Component {

	render() {
		const { auth, passage, isRtl } = this.props

		let mainVerse, versesCarousel, plansCarousel = null

		if (passage && passage.verses) {
			Object.keys(passage.verses).forEach((key, index) => {
				let verse = { [key]: passage.verses[key] }
				if (index == 0) {
					mainVerse = <VerseCard verses={verse} />
				}
			})
		}

		return (
			<div className=''>
				<div className='main-content'>
					<h2>Matthew 1:1</h2>
					<div className='row single-verse'>
						{ mainVerse }
					</div>
					<a className='chapter-button solid-button'>Read Full Chapter</a>
				</div>
				<div className='verses-carousel'></div>
				<div className='related-plans'>
					<Carousel carouselType='standard' imageConfig={passage.configuration} carouselContent={passage.readingPlans} isRtl={() => false}/>
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