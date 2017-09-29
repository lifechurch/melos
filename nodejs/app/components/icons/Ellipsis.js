import React, { PropTypes } from 'react'
import getProportionalSize from '../../lib/imageProportions'

function Ellipsis({ width, height, fill, className }) {
	const {
		height: finalHeight,
		width: finalWidth
	} = getProportionalSize({
		defaultHeight: Ellipsis.defaultProps.height,
		defaultWidth: Ellipsis.defaultProps.width,
		newHeight: height,
		newWidth: width
	})

	return (
		<svg
			className={className}
			width={finalWidth}
			height={finalHeight}
			viewBox="0 0 24 24"
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fillRule="evenodd"
				stroke="none"
				fill={fill}
				d="M 6,14 C 4.9,14 4,13.1 4,12 4,10.9 4.9,10 6,10 7.1,10 8,10.9 8,12 8,13.1 7.1,14 6,14 Z M 12,14 C 10.9,14 10,13.1 10,12 10,10.9 10.9,10 12,10 13.1,10 14,10.9 14,12 14,13.1 13.1,14 12,14 Z M 18,14 C 16.9,14 16,13.1 16,12 16,10.9 16.9,10 18,10 19.1,10 20,10.9 20,12 20,13.1 19.1,14 18,14 Z M 18,14"
			/>
		</svg>
	)
}

Ellipsis.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	fill: PropTypes.string,
	className: PropTypes.string
}

Ellipsis.defaultProps = {
	width: 24,
	height: 24,
	fill: '#444444',
	className: ''
}

export default Ellipsis
