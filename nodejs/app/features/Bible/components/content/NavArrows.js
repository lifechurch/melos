import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import CarouselArrow from '../../../../components/Carousel/CarouselArrow'
import StickyHeader from '../../../../components/StickyHeader'
import { ScreenSize } from '../../../../lib/responsiveConstants'
import SectionedLayout from '../../../../components/SectionedLayout'

function NavArrows(props) {

	const {
		previousURL,
		nextURL,
		isRtl,
		customPrevious,
		customNext,
		bottomPos,
		onNextClick,
		onPrevClick,
		leftClass,
		rightClass,
		localizedLink,
		extraClassNames,
		parallelVersion,
		screenSize
	} = props

	if (!previousURL && !nextURL) return (<div />)


	let left, right = null
	let previousIcon, nextIcon = null
	let style = {}

	if (bottomPos) {
		style = {
			bottom: bottomPos
		}
	}

	if (customPrevious) {
		previousIcon = customPrevious
	} else {
		previousIcon = (
			<CarouselArrow
				key='left'
				dir={isRtl ? 'right' : 'left'}
				fill='#888888'
				containerClass='circle-buttons'
				arrowClass='reader-arrow'
				width={24}
				height={24}
				thin={false}
			/>
		)
	}
	if (customNext) {
		nextIcon = customNext
	} else {
		nextIcon = (
			<CarouselArrow
				key='right'
				dir={isRtl ? 'left' : 'right'}
				fill='#888888'
				containerClass='circle-buttons'
				arrowClass='reader-arrow'
				width={24}
				height={24}
				thin={false}
			/>
		)
	}

	if (previousURL) {
		if (isRtl) {
			right = (
				<Link
					to={{
						pathname: localizedLink(`${previousURL}`),
						query: parallelVersion ? { parallel: parallelVersion } : null
					}}
					onClick={onPrevClick}
					className={rightClass}
				>
					{ previousIcon }
				</Link>
			)
		} else {
			left = (
				<Link
					to={{
						pathname: localizedLink(`${previousURL}`),
						query: parallelVersion ? { parallel: parallelVersion } : null
					}}
					onClick={onPrevClick}
					className={leftClass}
				>
					{ previousIcon }
				</Link>
				)
		}
	}

	if (nextURL) {
		if (isRtl) {
			left = (
				<Link
					to={{
						pathname: localizedLink(`${nextURL}`),
						query: parallelVersion ? { parallel: parallelVersion } : null
					}}
					onClick={onNextClick}
					className={leftClass}
				>
					{ nextIcon }
				</Link>
			)
		} else {
			right = (
				<Link
					to={{
						pathname: localizedLink(`${nextURL}`),
						query: parallelVersion ? { parallel: parallelVersion } : null
					}}
					onClick={onNextClick}
					className={rightClass}
				>
					{ nextIcon }
				</Link>
			)
		}
	}

	return (
		<StickyHeader pinTo="bottom" verticalOffset={70} className={`reader-arrows ${extraClassNames}`} isSticky={screenSize === ScreenSize.SMALL}>
			<SectionedLayout
				left={<div className='prev-arrow' style={style}>{ left }</div>}
				right={<div className='next-arrow' style={style}>{ right }</div>}
			/>
		</StickyHeader>
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
	isRtl: PropTypes.bool.isRequired,
	customPrevious: PropTypes.node,
	customNext: PropTypes.node,
	onNextClick: PropTypes.func,
	onPrevClick: PropTypes.func,
	leftClass: PropTypes.string,
	rightClass: PropTypes.string,
	bottomPos: PropTypes.string,
	localizedLink: PropTypes.func,
	extraClassNames: PropTypes.string,
	parallelVersion: PropTypes.number,
	screenSize: PropTypes.number
}

NavArrows.defaultProps = {
	previousURL: null,
	nextURL: null,
	customPrevious: null,
	customNext: null,
	onNextClick: null,
	onPrevClick: null,
	leftClass: null,
	rightClass: null,
	bottomPos: null,
	localizedLink: (link) => { return link },
	extraClassNames: null,
	parallelVersion: null,
	screenSize: 0
}

export default NavArrows
