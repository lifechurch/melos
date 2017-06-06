import React, { Component, PropTypes } from 'react'

class SeekButton extends Component {
	constructor(props) {
		super(props)
		this.handleClick = ::this.handleClick
	}

	handleClick() {
		const { onClick, increment } = this.props
		if (typeof onClick === 'function') {
			onClick(increment)
		}
	}

	render() {
		const { width, height, color, increment } = this.props
		let transform = {}
		if (increment < 0 && typeof width !== 'undefined') {
			transform = { transform: `scaleX(-1) translateX(-${width}px)` }
		}

		return (
			<svg className="seek-button" onClick={this.handleClick} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 25 30">
				<g fill="none">
					<g transform="translate(-813 -250)translate(585 136)translate(228 115)">
						<g style={transform}>
							<path fill={color} d="M24 16.3L12.5 16.3 12.5 4.6C6.1 4.6 1 9.8 1 16.3 1 22.7 6.1 28 12.5 28 18.9 28 24 22.7 24 16.3ZM12.5 16.3L25 16.3C25 23.3 19.4 29 12.5 29 5.6 29 0 23.3 0 16.3 0 9.3 5.6 3.6 12.5 3.6L12.5 16.3Z" />
							<polygon points="24.5 3.6 18 0 18 3.6 12 0 12 7.6 18 4.1 18 7.6" stroke={color} />
						</g>
						<text fontFamily="Arial,Helvetica" fontSize="12" fill={color}>
							<tspan x="6" y="21.7">{Math.abs(increment)}</tspan>
						</text>
					</g>
				</g>
			</svg>
		)
	}
}

SeekButton.propTypes = {
	width: React.PropTypes.number,
	height: React.PropTypes.number,
	color: React.PropTypes.string,
	onClick: React.PropTypes.func,
	increment: React.PropTypes.number
}

SeekButton.defaultProps = {
	width: 23,
	height: 31,
	color: '#89847D',
	increment: 30
}

export default SeekButton
