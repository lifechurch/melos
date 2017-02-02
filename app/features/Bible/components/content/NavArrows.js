import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import CarouselArrow from '../../../../components/Carousel/CarouselArrow'

function NavArrows(props) {

	const {
		previousURL,
		nextURL,
		customPrevious,
		customNext,
		leftClass,
		rightClass,
		localizedLink,
	} = props

	if (!previousURL && !nextURL) return (<div></div>)


	let left, right = null
	let previousIcon, nextIcon = null

	if (customPrevious) {
		previousIcon = customPrevious
	} else {
		previousIcon = (
			<CarouselArrow
				key='left'
				dir='left'
				fill='#888888'
				containerClass='prev-arrow'
				arrowClass='reader-arrow'
				width={18}
				height={35}
			/>
		)
	}
	if (customNext) {
		nextIcon = customNext
	} else {
		nextIcon = (
			<CarouselArrow
				key='right'
				dir='right'
				fill='#888888'
				containerClass='next-arrow'
				arrowClass='reader-arrow'
				width={18}
				height={35}
			/>
		)
	}

	if (previousURL) {
		left = (
			<Link to={localizedLink(`${previousURL}`)}>
				{ previousIcon }
			</Link>
		)
	}

	if (nextURL) {
		right = (
			<Link to={localizedLink(`${nextURL}`)}>
				{ nextIcon }
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


/**
 *	previousURL			{string}		url to link to on the previous icon
 *	nextURL					{string}		url to link to on the next icon
 *	customPrevious	{node}			optional component to pass as the previous icon
 *	customNext			{node}			optional component to pass as the next icon
 */
NavArrows.propTypes = {
	previousURL: PropTypes.string,
	nextURL: PropTypes.string,
	customPrevious: PropTypes.node,
	customNext: PropTypes.node,
}

NavArrows.defaultProps = {
	previousURL: null,
	nextURL: null,
	customPrevious: null,
	customNext: null,
}

export default NavArrows