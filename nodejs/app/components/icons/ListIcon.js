import React from 'react'
import PropTypes from 'prop-types'

function ListIcon({ width, height, fill }) {
	return (
		<div className="bubblesicon-container vertical-center">
			<svg className='bubblesicon' viewBox="0 0 33 15" width={width} height={height} version="1.1" xmlns="http://www.w3.org/2000/svg">
				<g transform="translate(-734.000000, -236.000000)" fill={fill}>
					<g transform="translate(658.000000, 222.000000)">
						<g transform="translate(-19.539394, 0.000000)">
							<rect x="96.1939394" y="26.25" width="31.5636364" height="2.25" />
							<rect x="96.1939394" y="20.25" width="31.5636364" height="2.25" />
							<rect x="96.1939394" y="14.25" width="31.5636364" height="2.25" />
						</g>
					</g>
				</g>
			</svg>
		</div>
	)
}


ListIcon.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	fill: PropTypes.string,
}

ListIcon.defaultProps = {
	width: 35,
	height: 15,
	fill: 'white',
}

export default ListIcon
