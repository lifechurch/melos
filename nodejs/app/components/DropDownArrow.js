import React from 'react'
import PropTypes from 'prop-types'
import getProportionalSize from '@youversion/utils/lib/images/imageProportions'

function DropDownArrow({ width, height, fill, className, dir }) {
	const {
		height: finalHeight,
		width: finalWidth
	} = getProportionalSize({
		defaultHeight: DropDownArrow.defaultProps.height,
		defaultWidth: DropDownArrow.defaultProps.width,
		newHeight: height,
		newWidth: width
	})

	const rotation = (dir === 'down') ? 0 : 180

	const classes = ''

	return (
		<svg
			className={className}
			width={finalWidth}
			height={finalHeight}
			viewBox="189 13 12 7"
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			fillRule="evenodd"
		>
			<polygon stroke="none" fill={fill} fillRule="evenodd" transform={`translate(195.000000, 17.000000) rotate(${rotation}) translate(-195.000000, -17.000000)`} points="189 14 195 20 201 14" />
		</svg>
	)
}

DropDownArrow.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	fill: PropTypes.string,
	className: PropTypes.string,
	dir: PropTypes.oneOf(['up', 'down'])
}

DropDownArrow.defaultProps = {
	width: 40,
	height: 40,
	fill: '#444444',
	className: 'dropdown-arrow',
	dir: 'down'
}

export default DropDownArrow
