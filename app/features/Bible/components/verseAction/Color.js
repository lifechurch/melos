import React, { Component, PropTypes } from 'react'

class Color extends Component {

	render() {
		const { color, onSelect } = this.props

		if (color) {
			return (
				<div className='color' style={ { 'backgroundColor': `#${color}` } } onClick={onSelect.bind(this, color)}></div>
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