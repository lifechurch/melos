import React, { PropTypes } from 'react'

function BubblesIcon({ width, height, fill }) {
	return (
		<div className="bubblesicon-container vertical-center">
			<svg className='bubblesicon' viewBox="0 0 21 23" width={width} height={height} version="1.1" xmlns="http://www.w3.org/2000/svg">
				<g transform="translate(-679.000000, -231.000000)" fill={fill}>
					<g transform="translate(658.000000, 222.000000)">
						<g transform="translate(21.042424, 9.750000)">
							<g>
								<ellipse cx="5.89090909" cy="5.93181818" rx="5.89090909" ry="5.93181818" />
								<ellipse cx="16.0363636" cy="12.7613636" rx="4.25454545" ry="4.28409091" />
								<ellipse cx="6.87272727" cy="17.4659091" rx="4.25454545" ry="4.28409091" />
							</g>
						</g>
					</g>
				</g>
			</svg>
		</div>
	)
}


BubblesIcon.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	fill: PropTypes.string,
}

BubblesIcon.defaultProps = {
	width: 22,
	height: 22,
	fill: 'white',
}

export default BubblesIcon
