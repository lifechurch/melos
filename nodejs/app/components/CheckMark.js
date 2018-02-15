import React from 'react'
import PropTypes from 'prop-types'


function CheckMark(props) {
	const { width, height, fill, dir, style, thin } = props
	const rotation = (dir === 'right') ? 0 : 180
	const classes = 'checkmark-container'
	return (
		<div className={classes}>
			<svg className={`checkmark-${dir}`} viewBox="0 0 24 24" width={width} height={height} style={style} version="1.1" xmlns="http://www.w3.org/2000/svg">
				{ thin
					? <path transform={`rotate(${rotation}, ${width / 2}, ${height / 2})`} stroke="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" fill={fill} d="M 8.13,12.48 L 10.78,15.14 10.78,15.14 C 10.87,15.23 11.03,15.23 11.13,15.14 L 11.13,15.14 18.02,8.24 18.02,8.24 C 18.42,7.85 19.05,7.85 19.44,8.24 L 19.44,8.24 19.44,8.24 C 19.83,8.63 19.83,9.27 19.44,9.66 L 11.66,17.44 11.66,17.44 C 11.27,17.83 10.63,17.83 10.24,17.44 L 10.24,17.44 6.71,13.9 6.71,13.9 C 6.32,13.51 6.32,12.88 6.71,12.49 L 6.71,12.48 6.71,12.48 C 7.1,12.09 7.74,12.09 8.13,12.48 L 8.13,12.48 Z M 8.13,12.48" />
					: <path transform={`rotate(${rotation}, ${width / 2}, ${height / 2})`} fillRule="evenodd" stroke="none" fill={fill} d="M 8.98,13.62 L 5.92,11.19 5.92,11.19 C 5.52,10.88 4.96,10.91 4.6,11.26 L 3.96,11.89 3.96,11.89 C 3.59,12.25 3.56,12.83 3.89,13.23 L 8.25,18.61 8.25,18.61 C 8.59,19.04 9.22,19.11 9.65,18.76 9.69,18.73 9.73,18.69 9.77,18.65 L 20.06,7.22 20.06,7.22 C 20.42,6.82 20.4,6.22 20.02,5.84 L 19.64,5.46 19.64,5.46 C 19.27,5.09 18.67,5.07 18.28,5.42 L 8.98,13.62 Z M 8.98,13.62" />
				}
			</svg>

		</div>
	)
}

CheckMark.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	fill: PropTypes.string,
	dir: PropTypes.string,
	style: PropTypes.object,
	thin: PropTypes.bool
}

CheckMark.defaultProps = {
	width: 24,
	height: 24,
	fill: '#4EAE50',
	dir: 'right',
	style: {},
	thin: false
}

export default CheckMark
