import React, { PropTypes } from 'react'
import getProportionalSize from '@youversion/utils/lib/images/imageProportions'

function More({ width, height, fill, className }) {
	const {
		height: finalHeight,
		width: finalWidth
	} = getProportionalSize({
		defaultHeight: More.defaultProps.height,
		defaultWidth: More.defaultProps.width,
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
			<g fill="none" fillRule="evenodd">
				<path d="M0 0h24v24H0z" />
				<path
					fill={fill}
					d="M18 19H6a1 1 0 0 1 0-2h12a1 1 0 0 1 0 2zm0-6H6a1 1 0 0 1 0-2h12a1 1 0 0 1 0 2zm0-6H6a1 1 0 1 1 0-2h12a1 1 0 0 1 0 2z"
				/>
			</g>
		</svg>
	)
}

More.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	fill: PropTypes.string,
	className: PropTypes.string
}

More.defaultProps = {
	width: 24,
	height: 24,
	fill: '#444444',
	className: ''
}

export default More
