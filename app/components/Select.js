import React, { Component, PropTypes } from 'react'
import Immutable from 'immutable'
import DropdownTransition from './DropdownTransition'
import DropDownArrow from './DropDownArrow'

class Select extends Component {

	constructor(props) {
		super(props)

		this.state = {
			selectedValue: props.initialValue || props.list[Object.keys(props.list)[0]],
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

	selectOption(key) {
		const { list, onChange } = this.props
		this.setState({
			selectedValue: list[key],
			dropdown: false,
		})

		if (typeof onChange == 'function') {
			onChange(key)
		}
	}

	handleClick() {
		const { dropdown } = this.state
		this.setState({ dropdown: !dropdown })
	}

	render() {
		const { list } = this.props
		const { selectedValue, dropdown } = this.state

		let optionList = []
		if (list && typeof list == 'object') {
			Object.keys(list).forEach((key) => {
				let val = list[key]
				// leave the selected value out of the list
				if (selectedValue !== val) {
					optionList.push (
						<li onClick={this.selectOption.bind(this, key)}>{val}</li>
					)
				}
			})
		}

		return (
			<div className='select-field'>
				<div className='select-heading'>
					<div className='selected'>{ selectedValue }</div>
					<div className='dropdown-arrow-container' onClick={this.handleClick} >
						<DropDownArrow dir={dropdown ? 'up' : 'down'} height={6} width={12} />
					</div>
				</div>
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
	list: React.PropTypes.object.isRequired,
	onChange: PropTypes.func,
	value: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
	initialValue: React.PropTypes.string,
}

export default Select