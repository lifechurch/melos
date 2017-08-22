import React, { PropTypes } from 'react'


function CheckMark(props) {
	const { width, height, fill, dir, style } = props
	const rotation = (dir === 'right') ? 0 : 180
	const classes = 'checkmark-container'
	return (
		<div className={classes}>
			<svg className={`checkmark-${dir}`} viewBox="3 9 8 6" width={width} height={height} style={style} version="1.1" xmlns="http://www.w3.org/2000/svg">
				<polygon transform={`rotate(${rotation})`} stroke="none" fill={fill} fillRule="evenodd" points="9.59694776 9.13920942 5.9208144 12.4484412 4.53882817 11.3293834 3.83596446 12.0390452 5.40475625 14.0128512 5.9208144 14.6638476 6.49497595 14.0128512 10.2323365 9.78011287 9.59694776 9.13920942 9.59694776 9.13920942" />
			</svg>
		</div>
	)
}

CheckMark.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	fill: PropTypes.string,
	dir: PropTypes.string,
	style: PropTypes.object
}

CheckMark.defaultProps = {
	width: 15,
	height: 15,
	fill: '#4EAE50',
	dir: 'right',
	style: {}
}

export default CheckMark
