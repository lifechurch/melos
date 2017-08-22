import React, { PropTypes } from 'react'

function PlusButton({ width, height, fill, className }) {
	return (
		<svg
			className={`plus-button ${className}`}
			viewBox="0 0 17 17"
			width={width}
			height={height}
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				stroke="none"
				fill="transparent"
				fillRule="evenodd"
				d="M0,8.5 C0,13.1943592 3.80564078,17 8.5,17 C9.48971832,17 10.4399332,16.8308397 11.323309,16.5198549 C14.6298961,15.3557994 17,12.2046409 17,8.5 C17,3.80564078 13.1948608,0 8.5,0 C3.80564078,0 0,3.80564078 0,8.5 Z"
			/>
			<path
				stroke="none"
				fill={fill}
				fillRule="evenodd"
				d="M9,8 L9,4 L8,4 L8,8 L4,8 L4,9 L8,9 L8,13 L9,13 L9,9 L13,9 L13,8 L9,8Z"
			/>
		</svg>
	)
}

PlusButton.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	fill: PropTypes.string,
	className: PropTypes.string
}

PlusButton.defaultProps = {
	width: 17,
	height: 17,
	fill: '#979797',
	className: null
}

export default PlusButton
