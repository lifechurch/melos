import React, { Component, PropTypes } from 'react'
import CarouselArrow from '../../../../components/Carousel/CarouselArrow'
import { Link } from 'react-router'

class ReaderArrows extends Component {

	render() {
		const {
			previousChapterURL,
			nextChapterURL,
			localizedLink,
		} = this.props

		let left, right = null

		if (previousChapterURL) {
			left = (
				<Link to={localizedLink(`${previousChapterURL}`)}>
					<CarouselArrow
						key='left'
						dir='left'
						fill='#888888'
						containerClass='prev-arrow'
						arrowClass='reader-arrow'
						width={18}
						height={35}
					/>
				</Link>
			)
		}

		if (nextChapterURL) {
			right = (
				<Link to={localizedLink(`${nextChapterURL}`)}>
					<CarouselArrow
						key='right'
						dir='right'
						fill='#888888'
						containerClass='next-arrow'
						arrowClass='reader-arrow'
						width={18}
						height={35}
					/>
				</Link>
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
 *	previousChapterURL		{string}		usfm to call for new chapter
 *	nextChapterURL				{string}		usfm to call for new chapter
 */
ReaderArrows.propTypes = {
	previousChapterURL: React.PropTypes.string,
	nextChapterURL: React.PropTypes.string,
}

export default ReaderArrows