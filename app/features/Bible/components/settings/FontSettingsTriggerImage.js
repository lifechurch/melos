import React, { Component } from 'react'

class FontSettingsTriggerImage extends Component {
	render() {
		const { width, height, color } = this.props
		return (
			<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox={`0 0 21 14`}>
				<g fill="none">
					<g fill={color}>
							<path d="M9.6 13.5L11.3 13.5 6.5 0.5 4.9 0.5 0.1 13.5 1.8 13.5 3.1 9.8 8.3 9.8 9.6 13.5ZM5.7 2.6L5.8 2.6 7.8 8.4 3.6 8.4 5.7 2.6ZM16.3 12.3C15.2 12.3 14.4 11.7 14.4 10.7 14.4 9.8 15 9.2 16.5 9.1L19.1 9 19.1 9.9C19.1 11.3 17.9 12.3 16.3 12.3L16.3 12.3ZM16 13.7C17.3 13.7 18.4 13.1 19 12.1L19.2 12.1 19.2 13.5 20.7 13.5 20.7 6.8C20.7 4.8 19.3 3.6 17 3.6 14.9 3.6 13.4 4.6 13.1 6.2L14.7 6.2C14.9 5.4 15.8 5 16.9 5 18.4 5 19.1 5.6 19.1 6.8L19.1 7.7 16.3 7.9C14 8 12.8 9 12.8 10.8 12.8 12.6 14.2 13.7 16 13.7L16 13.7Z"/>
					</g>
				</g>
			</svg>
		)
	}
}

FontSettingsTriggerImage.propTypes = {
	width: React.PropTypes.number,
	height: React.PropTypes.number,
	color: React.PropTypes.string,
}

FontSettingsTriggerImage.defaultProps = {
	width: 21,
	height: 14,
	color: '#979797'
}

export default FontSettingsTriggerImage