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
				<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 23 31">
					<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
						<g transform="translate(-734.000000, -252.000000)" fill={color}>
							<g transform="translate(585.000000, 136.000000)">
								<polygon points="149 146.5 171.5 131.5 149 116.5"></polygon>
							</g>
						</g>
					</g>
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
	width: 23,
	height: 31,
	color: '#FFFFFF'
}

export default PlayButton