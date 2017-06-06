import React, { Component, PropTypes } from 'react'
import shadeColor from '../../../../lib/shadeColor'
import XMark from '../../../../components/XMark'

class Color extends Component {

	onSelect = () => {
		const { onClick, color } = this.props
		if (typeof onClick == 'function') {
			onClick(color)
		}
	}

	onDelete = () => {
		const { deleteColor, color } = this.props
		if (typeof deleteColor == 'function') {
			deleteColor(color)
		}
	}

	render() {
		const { color, deleteColor } = this.props

		if (color) {
			let val
			if (color.charAt(0) === '#') {
				val = color.slice(1)
			} else {
				val = color
			}
			if (deleteColor) {
				return (
					<div className={`color color-${val}`} style={ { 'backgroundColor': `#${val}` } } onClick={this.onSelect}>
						<style>
						{`
							.color-${val}:hover {
								border: 1px solid ${shadeColor(`#${val}`, -0.18)}
							}
						`}
						</style>
						<div className='delete-color' onClick={this.onDelete}><XMark height={10} width={10} /></div>
					</div>
				)
			} else {
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
			}
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
 * 		@deleteColor					function to show X and delete color
 */
Color.propTypes = {
	color: React.PropTypes.string,
	onSelect: React.PropTypes.func,
	deleteColor: React.PropTypes.func,
}

export default Color