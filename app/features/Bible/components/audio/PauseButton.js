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
				<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 353.6 353.6">
					<path fill={color} d="M41.1 353.6h109V0H41.1V353.6z"/>
					<path fill={color} d="M203.5 0v353.6h109V0H203.5z"/>
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
	width: 23,
	height: 31,
	color: '#FFFFFF'
}

export default PauseButton