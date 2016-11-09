import React, { Component, PropTypes } from 'react'
import CarouselArrow from '../../../../components/Carousel/CarouselArrow'

class ReaderArrows extends Component {

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

		let left, right = null

		if (previousChapter) {
			left = (
				<div onClick={this.getChapter.bind(this, previousChapter)}>
					<CarouselArrow
						key='left'
						dir='left'
						fill='#888888'
						containerClass='prev-arrow'
						arrowClass='reader-arrow'
						width={18}
						height={35}
					/>
				</div>
			)
		}

		if (nextChapter) {
			right = (
				<div onClick={this.getChapter.bind(this, nextChapter)}>
					<CarouselArrow
						key='right'
						dir='right'
						fill='#888888'
						containerClass='next-arrow'
						arrowClass='reader-arrow'
						width={18}
						height={35}
					/>
				</div>
			)
		}

		return (
			<div className='reader-arrows'>
				{ left }
				{ right }
			</div>
		)
	}
}


/**
 *	previousChapter		{string}		usfm to call for new chapter
 *	nextChapter				{string}		usfm to call for new chapter
 */
ReaderArrows.propTypes = {
	previousChapter: React.PropTypes.string,
	nextChapter: React.PropTypes.string,
}

export default ReaderArrows