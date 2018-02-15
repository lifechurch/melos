import React from 'react'
import PropTypes from 'prop-types'
import getProportionalSize from '@youversion/utils/lib/images/imageProportions'

function VOTDIcon(props) {
	const { width, height, fill } = props
	const {
		height: finalHeight,
		width: finalWidth
	} = getProportionalSize({
		defaultHeight: VOTDIcon.defaultProps.height,
		defaultWidth: VOTDIcon.defaultProps.width,
		newHeight: height,
		newWidth: width
	})
	return (
		<svg
			width={typeof finalWidth === 'string' ? finalWidth : `${finalWidth}px`}
			height={typeof finalHeight === 'string' ? finalHeight : `${finalHeight}px`}
			viewBox="0 0 24 24"
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fillRule="evenodd"
				stroke="none"
				fill={fill}
				d="M 11.77,2.51 L 10.77,4.77 C 11.17,4.7 11.58,4.67 12,4.67 12.42,4.67 12.83,4.7 13.23,4.77 L 12.23,2.51 C 12.17,2.39 12.03,2.33 11.9,2.39 11.84,2.41 11.8,2.46 11.77,2.51 L 11.77,2.51 Z M 12.23,21.49 L 13.23,19.23 C 12.83,19.3 12.42,19.33 12,19.33 11.58,19.33 11.17,19.3 10.77,19.23 L 11.77,21.49 C 11.83,21.61 11.98,21.67 12.1,21.61 12.16,21.59 12.2,21.54 12.23,21.49 Z M 17.98,16.24 L 18.87,18.55 C 18.92,18.68 18.85,18.82 18.73,18.87 18.67,18.89 18.6,18.89 18.55,18.87 L 16.24,17.98 C 16.91,17.5 17.5,16.91 17.98,16.24 L 17.98,16.24 Z M 6.02,7.76 L 5.13,5.45 C 5.08,5.32 5.15,5.18 5.27,5.13 5.33,5.11 5.4,5.11 5.45,5.13 L 7.76,6.02 C 7.08,6.5 6.5,7.09 6.02,7.76 Z M 21.49,11.77 L 19.23,10.77 C 19.3,11.17 19.33,11.58 19.33,12 19.33,12.42 19.3,12.83 19.23,13.23 L 21.49,12.23 C 21.61,12.17 21.67,12.02 21.61,11.9 21.59,11.84 21.54,11.8 21.49,11.77 L 21.49,11.77 Z M 2.51,12.23 L 4.77,13.23 C 4.7,12.83 4.67,12.42 4.67,12 4.67,11.58 4.7,11.17 4.77,10.77 L 2.51,11.77 C 2.39,11.83 2.33,11.97 2.39,12.1 2.41,12.16 2.46,12.2 2.51,12.23 L 2.51,12.23 Z M 16.24,6.02 L 18.55,5.13 C 18.68,5.08 18.82,5.15 18.87,5.27 18.89,5.33 18.89,5.4 18.87,5.45 L 17.98,7.76 C 17.5,7.09 16.91,6.5 16.24,6.02 Z M 7.76,17.98 L 5.45,18.87 C 5.32,18.92 5.18,18.85 5.13,18.72 5.11,18.67 5.11,18.6 5.13,18.54 L 6.02,16.24 C 6.5,16.91 7.09,17.5 7.76,17.98 L 7.76,17.98 Z M 12,17.34 C 9.06,17.34 6.67,14.95 6.67,12 6.67,9.06 9.06,6.67 12,6.67 14.95,6.67 17.34,9.06 17.34,12 17.34,14.95 14.95,17.34 12,17.34 Z M 15.34,12 C 15.34,10.16 13.85,8.67 12,8.67 10.16,8.67 8.67,10.16 8.67,12 8.67,13.85 10.16,15.34 12,15.34 13.85,15.34 15.34,13.85 15.34,12 Z M 15.34,12"
			/>
		</svg>
	)
}

VOTDIcon.propTypes = {
	width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	fill: PropTypes.string,
}

VOTDIcon.defaultProps = {
	width: 40,
	height: 40,
	fill: 'black',
}

export default VOTDIcon
