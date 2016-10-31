import React, { Component, PropTypes } from 'react'
import Color from './Color'

class ColorList extends Component {

	constructor(props) {
		super(props)
		this.state = {

		}

		this.getColor = ::this.getColor
	}

	getColor(index) {

	}

	render() {
		const { list } = this.props

		let colors = null

		if (list) {
			colors = list.map((color, index) => {
				return (
					<Color color={color} onSelect={this.getColor} index={index} />
				)
			})
		}

		return (
			<div className='color-list'>
				{ colors }
			</div>
		)
	}
}

ColorList.propTypes = {
	colors: React.PropTypes.array
}

export default ColorList