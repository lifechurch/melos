import React, { Component, PropTypes } from 'react'
import Immutable from 'immutable'
import DropdownTransition from './DropdownTransition'
import DropDownArrow from './DropDownArrow'

class Select extends Component {

	constructor(props) {
		super(props)
		const { list } = props
		let selectedVal, selectedKey
		if (Array.isArray(list)) {
			selectedKey = null
			selectedVal = list[0]
		} else if (typeof list === 'object') {
			selectedKey = Object.keys(list)[0]
			selectedVal = list[selectedKey]
		}

		this.state = {
			selectedKey,
			selectedValue: props.initialValue || selectedVal,
			dropdown: false,
		}

		this.handleClick = ::this.handleClick
	}

	// if we're passing in a new value, set that in state accordingly
	// otherwise, this component takes care of setting the value
	componentWillReceiveProps(nextProps) {
		const { selectedValue } = this.props
		if (selectedValue !== nextProps.value) {
			this.setState({ selectedValue: nextProps.selectedValue })
		}
	}

	selectOption(selectEvent) {
		const { onChange } = this.props
		const { key, value } = selectEvent
		this.setState({
			selectedKey: key,
			selectedValue: value,
			dropdown: false,
		})

		if (typeof onChange === 'function') {
			onChange({ key, value })
		}
	}

	handleClick() {
		const { dropdown } = this.state
		this.setState({ dropdown: !dropdown })
	}

	render() {
		const { list, dropdownTrigger } = this.props
		const { selectedValue, dropdown } = this.state

		const optionList = []
		if (list) {
			if (typeof list === 'object') {
				Object.keys(list).forEach((key) => {
					const value = list[key]
					// leave the selected value out of the list
					if (selectedValue !== value) {
						optionList.push(
							<li key={key} onClick={this.selectOption.bind(this, { key, value })}>{value}</li>
						)
					}
				})
			} else if (Array.isArray(list)) {
				list.forEach((item, index) => {
					if (selectedValue !== index) {
						optionList.push(
							<li key={item} onClick={this.selectOption.bind(this, item)}>{item}</li>
						)
					}
				})
			}
		}
		let clickDiv = (
			<div className='select-heading'>
				<div className='selected'>{ selectedValue }</div>
				<div className='dropdown-arrow-container' onClick={this.handleClick} >
					<DropDownArrow dir={dropdown ? 'up' : 'down'} height={6} width={12} />
				</div>
			</div>
		)
		if (dropdownTrigger) {
			clickDiv = (
				<div className='select-heading' onClick={this.handleClick}>
					{ dropdownTrigger }
				</div>
			)
		}

		return (
			<div className='select-field'>
				{ clickDiv }
				<DropdownTransition show={dropdown} >
					<ul className='select-list'>
						{ optionList }
					</ul>
				</DropdownTransition>
			</div>
		)
	}
}



Select.propTypes = {
	list: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
	selectedValue: PropTypes.string,
	dropdownTrigger: PropTypes.node,
	onChange: PropTypes.func,
	value: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
	initialValue: PropTypes.string,
}

export default Select
