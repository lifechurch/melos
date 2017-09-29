import React, { Component, PropTypes } from 'react'

class PauseButton extends Component {
	constructor(props) {
		super(props)
		this.handleClick = ::this.handleClick
	}

	handleClick() {
		const { onClick } = this.props
		if (typeof onClick === 'function') {
			onClick()
		}
	}

	render() {
		const { width, height, color } = this.props
		return (
			<div className='circle-button pause' onClick={this.handleClick}>
				<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24">
					<path fillRule="evenodd" stroke="none" fill={color} d="M 14,5 L 14,19 14,19 C 14,19.55 14.45,20 15,20 L 17.8,20 17.8,20 C 18.35,20 18.8,19.55 18.8,19 L 18.8,5 18.8,5 C 18.8,4.45 18.35,4 17.8,4 L 15,4 15,4 C 14.45,4 14,4.45 14,5 Z M 6,5 L 6,19 6,19 C 6,19.55 6.45,20 7,20 L 9.8,20 9.8,20 C 10.35,20 10.8,19.55 10.8,19 L 10.8,5 10.8,5 C 10.8,4.45 10.35,4 9.8,4 L 7,4 7,4 C 6.45,4 6,4.45 6,5 Z M 6,5" />
				</svg>
			</div>
		)
	}
}

PauseButton.propTypes = {
	width: React.PropTypes.number,
	height: React.PropTypes.number,
	color: React.PropTypes.string,
	onClick: React.PropTypes.func
}

PauseButton.defaultProps = {
	width: 32,
	height: 32,
	color: '#FFFFFF'
}

export default PauseButton
