import React, { PropTypes } from 'react'
import getProportionalSize from '../lib/imageProportions'

function TwitterLogo({ width, height, fill, className }) {
	const {
		height: finalHeight,
		width: finalWidth
	} = getProportionalSize({
		defaultHeight: TwitterLogo.defaultProps.height,
		defaultWidth: TwitterLogo.defaultProps.width,
		newHeight: height,
		newWidth: width
	})

	return (
		<svg
			className={className}
			width={finalWidth}
			height={finalHeight}
			viewBox="0 0 24 19"
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
				<g transform="translate(-687.000000, -110.000000)" fill={fill}>
					<g transform="translate(490.000000, 62.000000)">
						<g transform="translate(29.000000, 44.000000)">
							<path d="M188.147189,5.49650053 C187.252062,4.57532315 185.975993,4 184.564119,4 C181.853114,4 179.655441,6.1230002 179.655441,8.74125706 C179.655441,9.11269955 179.699001,9.47588776 179.781852,9.82256742 C175.702533,9.62529019 172.086152,7.73836233 169.664697,4.86835 C169.242757,5.56913817 169.000185,6.38218452 169.000185,7.25218538 C169.000185,8.8972629 169.867125,10.3491903 171.184192,11.1985555 C170.379603,11.1746181 169.622845,10.9616577 168.960895,10.6058984 L168.960895,10.6653292 C168.960895,12.9616692 170.652924,14.8783125 172.898428,15.3149637 C172.486738,15.4230948 172.052841,15.4808747 171.605277,15.4808747 C171.288396,15.4808747 170.981763,15.4511593 170.681964,15.3950302 C171.306332,17.2794818 173.118794,18.6505173 175.267781,18.688487 C173.58771,19.9596458 171.471179,20.7173884 169.17101,20.7173884 C168.775549,20.7173884 168.384358,20.6959273 168,20.6513542 C170.172049,21.9976269 172.751518,22.7826087 175.52402,22.7826087 C184.552161,22.7826087 189.489879,15.5568141 189.489879,9.29099195 C189.489879,9.08463501 189.485608,8.88075435 189.476213,8.67769912 C190.434545,8.00827721 191.267321,7.17376974 191.925,6.22287696 C191.045247,6.60009745 190.098873,6.85515462 189.105521,6.96823823 C190.119372,6.38135909 190.897483,5.45275286 191.263904,4.34585423 C190.315821,4.8889857 189.265243,5.28519102 188.147189,5.49650053 Z" id="twitter" />
						</g>
					</g>
				</g>
			</g>
		</svg>
	)
}

TwitterLogo.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	fill: PropTypes.string,
	className: PropTypes.string
}

TwitterLogo.defaultProps = {
	width: 24,
	height: 19,
	fill: '#444444',
	className: ''
}

export default TwitterLogo