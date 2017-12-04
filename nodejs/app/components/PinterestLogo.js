import React, { PropTypes } from 'react'
import getProportionalSize from '@youversion/utils/lib/images/imageProportions'

function PinterestLogo({ width, height, fill, className }) {
	const {
		height: finalHeight,
		width: finalWidth
	} = getProportionalSize({
		defaultHeight: PinterestLogo.defaultProps.height,
		defaultWidth: PinterestLogo.defaultProps.width,
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
			<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
				<g transform="translate(-1046.000000, -107.000000)" fill={fill}>
					<g transform="translate(490.000000, 62.000000)">
						<g transform="translate(29.000000, 44.000000)">
							<path d="M527,13 C527,18.0839975 530.152987,22.4263642 534.603399,24.1744942 C534.498519,23.2253832 534.403908,21.7686082 534.644471,20.7326793 C534.862297,19.796076 536.047509,14.7672594 536.047509,14.7672594 C536.047509,14.7672594 535.689599,14.0484365 535.689599,12.9860208 C535.689599,11.3173513 536.653317,10.0717351 537.853931,10.0717351 C538.874856,10.0717351 539.367716,10.8398529 539.367716,11.7617413 C539.367716,12.7917842 538.714236,14.3309626 538.376862,15.757572 C538.095227,16.9516861 538.973868,17.9258124 540.148079,17.9258124 C542.274273,17.9258124 543.909073,15.6766401 543.909073,12.4305334 C543.909073,9.55744942 541.851087,7.54812998 538.912261,7.54812998 C535.508443,7.54812998 533.510598,10.1092581 533.510598,12.7564684 C533.510598,13.7872471 533.906647,14.8938075 534.400974,15.4949111 C534.498519,15.613366 534.513188,15.7178418 534.483851,15.8392397 C534.392906,16.2181484 534.191215,17.0333538 534.15161,17.1996321 C534.099537,17.4196199 533.977789,17.4659718 533.751161,17.3607603 C532.257178,16.6625383 531.32353,14.4714899 531.32353,12.711588 C531.32353,8.92618026 534.065066,5.44978541 539.227633,5.44978541 C543.376608,5.44978541 546.602203,8.41630901 546.602203,12.3805028 C546.602203,16.5161251 544.002218,19.8446352 540.394509,19.8446352 C539.18216,19.8446352 538.043154,19.2126303 537.652973,18.4665849 C537.652973,18.4665849 537.053033,20.7576947 536.907815,21.3190681 C536.637182,22.3616186 535.908159,23.6683017 535.420432,24.4651134 C536.539636,24.812385 537.729249,25 538.962867,25 C545.56881,25 550.925,19.6275904 550.925,13 C550.925,6.37240956 545.56881,1 538.962867,1 C532.35619,1 527,6.37240956 527,13 Z" />
						</g>
					</g>
				</g>
			</g>
		</svg>
	)
}

PinterestLogo.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	fill: PropTypes.string,
	className: PropTypes.string
}

PinterestLogo.defaultProps = {
	width: 24,
	height: 24,
	fill: '#444444',
	className: ''
}

export default PinterestLogo
