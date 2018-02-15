import React from 'react'
import PropTypes from 'prop-types'
import getProportionalSize from '@youversion/utils/lib/images/imageProportions'

function Explore({ width, height, fill, className }) {
	const {
		height: finalHeight,
		width: finalWidth
	} = getProportionalSize({
		defaultHeight: Explore.defaultProps.height,
		defaultWidth: Explore.defaultProps.width,
		newHeight: height,
		newWidth: width
	})

	return (
		<svg
			className={className}
			width={finalWidth}
			height={finalHeight}
			viewBox="0 0 18 18"
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			fillRule="evenodd"
		>
			<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
				<g transform="translate(-228.000000, -17.000000)">
					<g transform="translate(228.000000, 17.000000)">
						<path d="M9,0 C4.032,0 0,4.032 0,9 C0,13.968 4.032,18 9,18 C13.968,18 18,13.968 18,9 C18,4.032 13.968,0 9,0 Z" id="Path" fill={fill} />
						<path d="M9,8.08333333 C8.49166667,8.08333333 8.08333333,8.49166667 8.08333333,9 C8.08333333,9.50833333 8.49166667,9.91666667 9,9.91666667 C9.50833333,9.91666667 9.91666667,9.50833333 9.91666667,9 C9.91666667,8.49166667 9.50833333,8.08333333 9,8.08333333 Z M10.825,10.825 L4,14 L7.175,7.175 L14,4 L10.825,10.825 Z" id="Shape" fill="#FFFFFF" fillRule="nonzero" />
					</g>
				</g>
			</g>
		</svg>
	)
}

Explore.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	fill: PropTypes.string,
	className: PropTypes.string
}

Explore.defaultProps = {
	width: 18,
	height: 18,
	fill: '#444444',
	className: ''
}

export default Explore
