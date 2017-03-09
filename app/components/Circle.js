import React, { PropTypes } from 'react'

function Circle(props) {
	const { style } = props
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" style={style}>
			<g fill="none">
				<g style={{ strokeWidth: 1, stroke: '#979797' }}>
					<path d="M8 16C12.4 16 16 12.4 16 8 16 3.6 12.4 0 8 0 3.6 0 0 3.6 0 8 0 12.4 3.6 16 8 16Z" />
					<mask maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" width="16" height="16" fill="white" />
				</g>
			</g>
		</svg>
	)
}

Circle.propTypes = {
	style: PropTypes.object
}

Circle.defaultProps = {
	style: {}
}

export default Circle