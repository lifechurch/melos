import React, { PropTypes } from 'react'
import getProportionalSize from '@youversion/utils/lib/images/imageProportions'

function Plans({ width, height, fill, className }) {
	const {
		height: finalHeight,
		width: finalWidth
	} = getProportionalSize({
		defaultHeight: Plans.defaultProps.height,
		defaultWidth: Plans.defaultProps.width,
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
			fillRule="evenodd"
		>
			<path
				fillRule="evenodd"
				stroke="none"
				fill={fill}
				d="M 8.98,13.62 L 5.92,11.19 5.92,11.19 C 5.52,10.88 4.96,10.91 4.6,11.26 L 3.96,11.89 3.96,11.89 C 3.59,12.25 3.56,12.83 3.89,13.23 L 8.25,18.61 8.25,18.61 C 8.59,19.04 9.22,19.11 9.65,18.76 9.69,18.73 9.73,18.69 9.77,18.65 L 20.06,7.22 20.06,7.22 C 20.42,6.82 20.4,6.22 20.02,5.84 L 19.64,5.46 19.64,5.46 C 19.27,5.09 18.67,5.07 18.28,5.42 L 8.98,13.62 Z M 8.98,13.62"
			/>
		</svg>
	)
}

Plans.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	fill: PropTypes.string,
	className: PropTypes.string
}

Plans.defaultProps = {
	width: 24,
	height: 24,
	fill: '#444444',
	className: ''
}

export default Plans
