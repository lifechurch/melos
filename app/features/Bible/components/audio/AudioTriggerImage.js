import React, { Component } from 'react'
import CircleProgress from  '../../../../components/CircleProgress'

class AudioTriggerImage extends Component {
	render() {
		const { width, height, color, percentComplete } = this.props
		return (
			<div className="audio-popup-trigger">
				<CircleProgress percent={percentComplete} width={width} height={height} strokeWidth={6} strokeLinecap="square" strokeColor="green" prefixCls="circle-progress" />
				<svg className="audio-icon" xmlns="http://www.w3.org/2000/svg" width={width / 2} height={height / 2} viewBox="0 0 22 25">
					<g fill="none">
						<g fill={color}>
							<path d="M16 24L15.2 22.3C15.2 22.3 21.6 19.6 21.6 12 21.6 4.4 15.2 1.8 15.2 1.8L16 0C16 0 23.5 3.2 23.5 12 23.5 20.8 16 24 16 24L16 24 16 24 16 24ZM17.3 12C17.3 16.5 13.3 18.3 13.3 18.3L12.5 16.6C12.5 16.6 15.4 15.3 15.4 12 15.4 8.3 12.5 7.3 12.5 7.3L13.6 5.6C13.6 5.6 17.3 7.4 17.3 12 17.3 12 17.3 7.4 17.3 12L17.3 12 17.3 12ZM1 14.8C0.4 14.8 0 14.5 0 13.8L0 10.6C0 10.1 0.4 9.7 1 9.7L3.6 9.7 8.8 4.4 8.8 20 3.6 14.8 1 14.8 1 14.8 1 14.8 1 14.8Z"/>
						</g>
					</g>
				</svg>
			</div>
		)
	}
}

AudioTriggerImage.propTypes = {
	width: React.PropTypes.number,
	height: React.PropTypes.number,
	color: React.PropTypes.string,
	percentComplete: React.PropTypes.number
}

AudioTriggerImage.defaultProps = {
	width: 20,
	height: 20,
	color: '#979797',
	percentComplete: 50
}

export default AudioTriggerImage