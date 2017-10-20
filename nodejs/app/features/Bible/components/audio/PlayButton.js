import React, { Component, PropTypes } from 'react'

class PlayButton extends Component {
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
			<div className='circle-button play' onClick={this.handleClick}>
				<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24">
					<path fillRule="evenodd" stroke="none" fill={color} d="M 8.55,18.96 L 17.75,12.83 17.75,12.83 C 18.21,12.53 18.34,11.9 18.03,11.45 17.96,11.34 17.86,11.24 17.75,11.17 L 8.55,5.04 8.55,5.04 C 8.1,4.73 7.47,4.85 7.17,5.31 7.06,5.48 7,5.67 7,5.87 L 7,18.13 7,18.13 C 7,18.68 7.45,19.13 8,19.13 8.2,19.13 8.39,19.07 8.55,18.96 Z M 8.55,18.96" />
				</svg>
			</div>
		)
	}
}

PlayButton.propTypes = {
	width: React.PropTypes.number,
	height: React.PropTypes.number,
	color: React.PropTypes.string,
	onClick: React.PropTypes.func
}

PlayButton.defaultProps = {
	width: 48,
	height: 48,
	color: '#FFFFFF'
}

export default PlayButton
