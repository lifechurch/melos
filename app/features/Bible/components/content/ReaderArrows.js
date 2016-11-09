import React, { Component, PropTypes } from 'react'
import CarouselArrow from '../../../../components/Carousel/CarouselArrow'

class ReaderArrows extends Component {

	constructor(props) {
		super(props)

		this.getChapter = ::this.getChapter
	}

	getChapter(chapter) {
		const { onClick } = this.props

		if (typeof onClick == 'function' && typeof chapter == 'string') {
			onClick(chapter)
		}
	}

	render() {
		const {
			previousChapter,
			nextChapter
		} = this.props

		return (
			<div className='reader-arrows'>
				<div onClick={this.getChapter.bind(this,previousChapter)}>
					<CarouselArrow dir='left' fill='#888888' containerClass='reader-arrow' arrowClass='arrow' />
				</div>
				<div onClick={this.getChapter.bind(this,nextChapter)}>
					<CarouselArrow dir='right' fill='#888888' containerClass='reader-arrow' arrowClass='arrow' />
				</div>
			</div>
		)
	}
}


/**
 * 		@list					  		array of list objects formatted:
 * 												{ label: 'labelname', [optionally] count: 3, [optionally] groupHeading: 'a' }
 */
ReaderArrows.propTypes = {

}

export default ReaderArrows