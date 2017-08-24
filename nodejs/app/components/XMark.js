import React, { PropTypes } from 'react'

function XMark({ width, height, fill, className }) {
	return (
		<div className={`xmark-container ${className} vertical-center`}>
			<svg
				className='xmark'
				viewBox='67 8 8 8'
				width={width}
				height={height}
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
			>
				<polygon
					stroke='none'
					fill={fill}
					fillRule='evenodd'
					points='74.0856176 9.4287633 71.5143809 12 74.0856176 14.5712367 73.5712367 15.0856176 71 12.5143809 68.4287633 15.0856176 67.9143824 14.5712367 70.4856191 12 67.9143824 9.4287633 68.4287633 8.91438245 71 11.4856191 73.5712367 8.91438245 74.0856176 9.4287633 74.0856176 9.4287633 74.0856176 9.4287633'
				/>
			</svg>
		</div>
	)
}

XMark.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	fill: PropTypes.string,
	className: PropTypes.string
}

XMark.defaultProps = {
	width: 8,
	height: 8,
	fill: '#979797',
	className: '',
}

export default XMark
