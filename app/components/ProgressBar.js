import React, { PropTypes } from 'react'


function ProgressBar({
	width,
	height,
	classes,
	color,
	percentComplete,
}) {
// TODO: change this to a component so we can animate the transition with lifecycle hooks
	const progressBarStyle = {
		height: `${height}`,
		width: `${width}`,
		borderRadius: '5px',
		overflow: 'hidden',
		border: `solid 1px ${color}`,
	}
	const progressStyle = {
		backgroundColor: `${color}`,
		height: '100%',
		borderRadius: '5px 0 0 5px',
		width: '100%',
		transform: `translate(${-1 * (100 - percentComplete)}%, 0)`,
		// transform: translate(-100%, 0),
		transition: 'transform 0.5s cubic-bezier(0.42,1,.16,.93)',
	}
	return (
		<div className={`progress-bar ${classes}`} style={progressBarStyle}>
			<div
				className={'progress'}
				style={progressStyle}
			>
				&nbsp;
			</div>
		</div>
	)
}

ProgressBar.propTypes = {
	color: PropTypes.string,
	height: PropTypes.string,
	width: PropTypes.string,
	classes: PropTypes.string,
	percentComplete: PropTypes.number,
}

ProgressBar.defaultProps = {
	color: 'white',
	height: '7px',
	width: '100%',
	classes: '',
	percentComplete: 0,
}

export default ProgressBar
