import React, { Component } from 'react'
import PropTypes from 'prop-types'

const VALID_COLUMN_COUNTS = [1, 2, 3, 4]

/**
 * Button component for use in the ButtonBar
 *  This exists as separate component so that click handler
 *  is not created as new function each render or loop iteration
 */
class ButtonBarButton extends Component {
	constructor(props) {
		super(props)
		this.handleClick = ::this.handleClick
	}

	handleClick() {
		const { item, onClick } = this.props
		if (typeof onClick === 'function') {
			onClick(item)
		}
	}

	render() {
		const { selectedClass, item } = this.props
		return (
			<div className={`yv-button-bar-button ${selectedClass}`} onClick={this.handleClick}>
				<div className='yv-button-bar-button-content'>{item.label}</div>
			</div>
		)
	}
}

ButtonBarButton.propTypes = {
	item: PropTypes.object.isRequired,
	selectedClass: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired
}


/**
 * ButtonBar component for display lists of buttons
 *  Optionally, can break into 2, 3 or 4 columns of buttons
 */
class ButtonBar extends Component {
	constructor(props) {
		super(props)
		const { initialValue, items } = props

		let initialItem = {}
		if (Array.isArray(items)) {
			items.forEach((item) => {
				if (item.value === initialValue) {
					initialItem = item
				}
			})
		}

		this.state = { selectedItem: initialItem }
		this.handleClick = ::this.handleClick
	}

	handleClick(item) {
		const { onClick } = this.props
		if (typeof onClick === 'function') {
			onClick(item)
		}
		this.setState({ selectedItem: item })
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.initialValue !== this.state.selectedItem.value) {
			let selectedItem = {}
			this.props.items.forEach((item) => {
				if (item.value === nextProps.initialValue) {
					selectedItem = item
				}
			})
			this.setState({ selectedItem })
		}
	}

	render() {
		const { items, cols } = this.props
		const columnsClass = VALID_COLUMN_COUNTS.indexOf(cols) !== -1 && cols !== 1 ? `cols cols-${cols.toString()}` : ''
		const buttons = items.map((item) => {
			const selectedClass = (item.value === this.state.selectedItem.value) ? 'selected' : ''
			return (<ButtonBarButton key={item.value} item={item} selectedClass={selectedClass} onClick={this.handleClick} />)
		})

		return (
			<div className={`yv-button-bar ${columnsClass}`}>
				{buttons}
			</div>
		)
	}
}

ButtonBar.propTypes = {
	items: PropTypes.array.isRequired,
	onClick: PropTypes.func,
	cols: PropTypes.oneOf(VALID_COLUMN_COUNTS),
	initialValue: PropTypes.any
}

export default ButtonBar
