import React from 'react'
import PropTypes from 'prop-types'
import Audio from './icons/Audio'

function AudioIcon(props) {
	const { width, height, color } = props
	return (
		<div className="audio-popup-trigger vertical-center">
			<Audio width={width} height={height} fill={color} />
		</div>
	)
}

AudioIcon.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	color: PropTypes.string,
}

AudioIcon.defaultProps = {
	width: 20,
	height: 20,
	color: '#979797',
}

export default AudioIcon
