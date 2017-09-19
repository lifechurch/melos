import React, { PropTypes } from 'react'

function HeartIcon({ width, height, fill }) {
	return (
		<div className='hearticon-container vertical-center'>
			<svg className='hearticon' viewBox='0 0 24 20' width={width} height={height} version='1.1' xmlns='http://www.w3.org/2000/svg' xlink='http://www.w3.org/1999/xlink'>
				<g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
					<g transform='translate(-530.000000, -131.000000)' fill={fill}>
						<g transform='translate(530.000000, 131.000000)'>
							<path d='M13.6872441,1.69434689 L11.9999153,3.38920428 L10.3132642,1.69434689 C8.06349247,-0.564782297 4.41642282,-0.564782297 2.16732877,1.69434689 C-0.0824429232,3.95347608 -0.0824429232,7.61681844 2.16732877,9.87662829 L11.9999153,19.7530864 L21.8331795,9.87662829 C24.0822735,7.6174991 24.0822735,3.95347608 21.8331795,1.69434689 C19.5834078,-0.564782297 15.9370158,-0.564782297 13.6872441,1.69434689 Z' />
						</g>
					</g>
				</g>
			</svg>
		</div>
	)
}


HeartIcon.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	fill: PropTypes.string,
}

HeartIcon.defaultProps = {
	width: 20,
	height: 20,
	fill: '#979797',
}

export default HeartIcon
