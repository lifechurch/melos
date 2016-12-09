import React, { Component, PropTypes } from 'react'
import shadeColor from '../../../../lib/shadeColor'

class Color extends Component {

	onSelect = () => {
		const { onClick, color } = this.props
		if (typeof onClick == 'function') {
			onClick(color)
		}
	}

	render() {
		const { color } = this.props

		if (color) {
			let val
			if (color.charAt(0) === '#') {
				val = color.slice(1)
			} else {
				val = color
			}
			return (
				<div className={`color color-${val}`} style={ { 'backgroundColor': `#${val}` } } onClick={this.onSelect}>
				<style>
				{`
					.color-${val}:hover {
						border: 1px solid ${shadeColor(`#${val}`, -0.18)}
					}
				`}
				</style>
				</div>
			)
		} else {
			return (
				<div></div>
			)
		}

	}
}


/**
 * 		@color					  		string of hex color
 * 		@onSelect			  			function to call when selecting color
 */
Color.propTypes = {
	color: React.PropTypes.string,
	onSelect: React.PropTypes.func
}

export default Color