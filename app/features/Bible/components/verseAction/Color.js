import React, { Component, PropTypes } from 'react'
import shadeColor from '../../../../lib/shadeColor'

class Color extends Component {

	render() {
		const { color, onSelect } = this.props

		if (color) {
			return (
				<div className={`color color-${color}`} style={ { 'backgroundColor': `#${color}` } } onClick={onSelect}>
				<style>
				{`
					.color-${color}:hover {
						border: 1px solid ${shadeColor(`#${color}`, -0.18)}
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