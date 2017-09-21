import React, { PropTypes } from 'react'
import getProportionalSize from '../../lib/imageProportions'

function Home({ width, height, fill, className }) {
	const {
		height: finalHeight,
		width: finalWidth
	} = getProportionalSize({
		defaultHeight: Home.defaultProps.height,
		defaultWidth: Home.defaultProps.width,
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
				d="M 10,14.5 L 10,19 10,19 C 10,19.55 9.55,20 9,20 L 5,20 5,20 C 4.45,20 4,19.55 4,19 L 4,11.98 4,11.98 C 4,11.7 4.11,11.44 4.32,11.25 L 11.32,4.67 11.32,4.67 C 11.7,4.31 12.3,4.31 12.69,4.67 L 19.68,11.25 19.68,11.25 C 19.89,11.44 20,11.7 20,11.98 L 20,19 20,19 C 20,19.55 19.55,20 19,20 L 15,20 15,20 C 14.45,20 14,19.55 14,19 L 14,14.5 14,14.5 C 14,14.22 13.78,14 13.5,14 L 10.5,14 10.5,14 C 10.22,14 10,14.22 10,14.5 Z M 10,14.5"
			/>
		</svg>
	)
}

Home.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	fill: PropTypes.string,
	className: PropTypes.string
}

Home.defaultProps = {
	width: 24,
	height: 24,
	fill: '#444444',
	className: ''
}

export default Home