import React, { PropTypes } from 'react'


function EllipsisMoreIcon({ width, height, fill }) {

	return (
		<div className='ellipsis-icon-container vertical-center'>
			<svg className='ellipsis-icon' viewBox='0 0 40 11' width={width} height={height} version='1.1' xmlns='http://www.w3.org/2000/svg' xlink='http://www.w3.org/1999/xlink'>
				<path stroke='none' fill={fill} fillRule='evenodd' d='M5,10 C7.76142389,10 10,7.76142389 10,5 C10,2.23857611 7.76142389,0 5,0 C2.23857611,0 0,2.23857611 0,5 C0,7.76142389 2.23857611,10 5,10 Z M20,10 C22.7614239,10 25,7.76142389 25,5 C25,2.23857611 22.7614239,0 20,0 C17.2385761,0 15,2.23857611 15,5 C15,7.76142389 17.2385761,10 20,10 Z M35,10 C37.7614239,10 40,7.76142389 40,5 C40,2.23857611 37.7614239,0 35,0 C32.2385761,0 30,2.23857611 30,5 C30,7.76142389 32.2385761,10 35,10 Z' />
			</svg>
		</div>
	)
}

EllipsisMoreIcon.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	fill: PropTypes.string,
}

EllipsisMoreIcon.defaultProps = {
	width: 20,
	height: 20,
	fill: '#979797',
}

export default EllipsisMoreIcon
