import React, { Component, PropTypes } from 'react'

class ButtonBar extends Component {
	constructor(props) {
		super(props)
		this.state = { selectedItem: {} }
	}

	handleClick(item) {
		const { onClick } = this.props
		if (typeof onClick === 'function') {
			onClick(item)
		}
		this.setState({ selectedItem: item })
	}

	render() {
		const { items } = this.props

		const buttons = items.map((item) => {
			const selectedClass = (item.value === this.state.selectedItem.value) ? 'selected' : ''
			return (
				<div className={`button-bar-button ${selectedClass}`} onClick={::this.handleClick.bind(this, item)}>
					<div className='button-bar-button-content'>{item.label}</div>
				</div>
			)
		})

		return (
			<div className='button-bar'>
				{buttons}
			</div>
		)
	}
}

ButtonBar.propTypes = {
	items: React.PropTypes.array.isRequired,
	onClick: React.PropTypes.func
}

export default ButtonBar
