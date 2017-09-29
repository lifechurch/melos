import React, { PropTypes } from 'react'
import getProportionalSize from '../../lib/imageProportions'

function Parallel({ width, height, fill, className }) {
	const {
		height: finalHeight,
		width: finalWidth
	} = getProportionalSize({
		defaultHeight: Parallel.defaultProps.height,
		defaultWidth: Parallel.defaultProps.width,
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
				d="M 3,17.44 C 3,18.3 3.9,19 5,19 L 8,19 8,19 C 8.55,19 9,18.55 9,18 L 9,18 9,18 C 9,17.45 8.55,17 8,17 L 5.25,17 5.25,17 C 5.11,17 5,16.89 5,16.75 L 5,7.25 5,7.25 C 5,7.11 5.11,7 5.25,7 L 8,7 8,7 C 8.55,7 9,6.55 9,6 L 9,6 9,6 C 9,5.45 8.55,5 8,5 L 5,5 C 3.9,5 3,5.7 3,6.56 L 3,17.44 Z M 21,17.44 C 21,18.3 20.1,19 19,19 L 16,19 16,19 C 15.45,19 15,18.55 15,18 L 15,18 15,18 C 15,17.45 15.45,17 16,17 L 18.75,17 18.75,17 C 18.89,17 19,16.89 19,16.75 L 19,7.25 19,7.25 C 19,7.11 18.89,7 18.75,7 L 16,7 16,7 C 15.45,7 15,6.55 15,6 L 15,6 15,6 C 15,5.45 15.45,5 16,5 L 19,5 C 20.1,5 21,5.7 21,6.56 L 21,17.44 Z M 13,19 L 13,5 13,5 C 13,4.45 12.55,4 12,4 L 12,4 12,4 C 11.45,4 11,4.45 11,5 L 11,19 11,19 C 11,19.55 11.45,20 12,20 L 12,20 12,20 C 12.55,20 13,19.55 13,19 Z M 13,19"
			/>
			<path
				fillRule="evenodd"
				stroke="none"
				fill={fill}
				d="M 7,8 L 9,8 C 9.55,8 10,8.45 10,9 L 10,9 C 10,9.55 9.55,10 9,10 L 7,10 C 6.45,10 6,9.55 6,9 L 6,9 6,9 C 6,8.45 6.45,8 7,8 L 7,8 Z M 15,8 L 17,8 C 17.55,8 18,8.45 18,9 L 18,9 C 18,9.55 17.55,10 17,10 L 15,10 C 14.45,10 14,9.55 14,9 L 14,9 14,9 C 14,8.45 14.45,8 15,8 Z M 7,11 L 9,11 C 9.55,11 10,11.45 10,12 10,12.55 9.55,13 9,13 L 7,13 C 6.45,13 6,12.55 6,12 6,11.45 6.45,11 7,11 L 7,11 Z M 15,11 L 17,11 C 17.55,11 18,11.45 18,12 18,12.55 17.55,13 17,13 L 15,13 C 14.45,13 14,12.55 14,12 14,11.45 14.45,11 15,11 Z M 7,14 L 9,14 C 9.55,14 10,14.45 10,15 10,15.55 9.55,16 9,16 L 7,16 C 6.45,16 6,15.55 6,15 6,14.45 6.45,14 7,14 L 7,14 Z M 15,14 L 17,14 C 17.55,14 18,14.45 18,15 18,15.55 17.55,16 17,16 L 15,16 C 14.45,16 14,15.55 14,15 14,14.45 14.45,14 15,14 Z M 15,14"
			/>
		</svg>
	)
}

Parallel.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	fill: PropTypes.string,
	className: PropTypes.string
}

Parallel.defaultProps = {
	width: 24,
	height: 24,
	fill: '#444444',
	className: ''
}

export default Parallel
