import React, { PropTypes } from 'react'
import getProportionalSize from '@youversion/utils/lib/images/imageProportions'

function YouTubeLogo({ width, height, fill, className }) {
	const {
		height: finalHeight,
		width: finalWidth
	} = getProportionalSize({
		defaultHeight: YouTubeLogo.defaultProps.height,
		defaultWidth: YouTubeLogo.defaultProps.width,
		newHeight: height,
		newWidth: width
	})

	return (
		<svg
			className={className}
			width={finalWidth}
			height={finalHeight}
			viewBox="0 0 24 18"
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
				<g transform="translate(-926.000000, -110.000000)" fill={fill}>
					<g transform="translate(490.000000, 62.000000)">
						<g transform="translate(29.000000, 44.000000)">
							<path d="M416.492518,16.3195833 L416.491417,9.12883357 L422.956051,12.7367359 L416.492518,16.3195833 L416.492518,16.3195833 Z M430.68609,7.88313013 C430.68609,7.88313013 430.452332,6.11954239 429.734945,5.34291636 C428.825165,4.32360879 427.805393,4.31854771 427.337737,4.25889205 C423.989783,4 418.967676,4 418.967676,4 L418.957277,4 C418.957277,4 413.935287,4 410.587216,4.25889205 C410.119537,4.31854771 409.100139,4.32360879 408.190031,5.34291636 C407.472691,6.11954239 407.239262,7.88313013 407.239262,7.88313013 C407.239262,7.88313013 407,9.95416628 407,12.0251774 L407,13.966755 C407,16.037741 407.239262,18.1087521 407.239262,18.1087521 C407.239262,18.1087521 407.472691,19.8723649 408.190031,20.6489909 C409.100139,21.6683235 410.295628,21.6360779 410.828094,21.7429119 C412.742117,21.9392419 418.9625,22 418.9625,22 C418.9625,22 423.989783,21.9919073 427.337737,21.7330403 C427.805393,21.6733596 428.825165,21.6683235 429.734945,20.6489909 C430.452332,19.8723649 430.68609,18.1087521 430.68609,18.1087521 C430.68609,18.1087521 430.925,16.037741 430.925,13.966755 L430.925,12.0251774 C430.925,9.95416628 430.68609,7.88313013 430.68609,7.88313013 L430.68609,7.88313013 Z" />
						</g>
					</g>
				</g>
			</g>
		</svg>
	)
}

YouTubeLogo.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	fill: PropTypes.string,
	className: PropTypes.string
}

YouTubeLogo.defaultProps = {
	width: 24,
	height: 18,
	fill: '#444444',
	className: ''
}

export default YouTubeLogo
