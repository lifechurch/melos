import React from 'react'
import PropTypes from 'prop-types'
import getProportionalSize from '@youversion/utils/lib/images/imageProportions'

function FacebookLogo({ width, height, fill, className }) {
	const {
		height: finalHeight,
		width: finalWidth
	} = getProportionalSize({
		defaultHeight: FacebookLogo.defaultProps.height,
		defaultWidth: FacebookLogo.defaultProps.width,
		newHeight: height,
		newWidth: width
	})

	return (
		<svg
			className={className}
			width={finalWidth}
			height={finalHeight}
			viewBox="0 0 14 26"
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
				<g transform="translate(-572.000000, -106.000000)" fill={fill}>
					<g transform="translate(490.000000, 62.000000)">
						<g transform="translate(29.000000, 44.000000)">
							<path d="M61.5063262,25.6004391 L61.5063262,13.866935 L65.7598541,13.866935 L66.8236009,9.60007319 L61.5070558,9.60007319 L61.5070558,6.40029275 C61.5070558,6.40029275 61.5070558,4.26686183 63.6338197,4.26686183 L66.8236009,4.26686183 L66.8236009,0.533540699 C66.8236009,0.533540699 66.8732132,1.42108547e-14 63.6338197,1.42108547e-14 C60.3936967,1.42108547e-14 57.2703085,1.33348581 57.2535279,6.40029275 L57.2535279,9.60007319 L53,9.60007319 L53,13.866935 L57.2535279,13.866935 L57.2535279,25.6004391 L61.5063262,25.6004391 Z" />
						</g>
					</g>
				</g>
			</g>
		</svg>
	)
}

FacebookLogo.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	fill: PropTypes.string,
	className: PropTypes.string
}

FacebookLogo.defaultProps = {
	width: 14,
	height: 26,
	fill: '#444444',
	className: ''
}

export default FacebookLogo
