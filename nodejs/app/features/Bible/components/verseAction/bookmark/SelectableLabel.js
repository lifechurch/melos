import React, { Component } from 'react'
import PropTypes from 'prop-types'


class SelectableLabel extends Component {

	constructor(props) {
		super(props)

		this.onSelect = ::this.onSelect
	}

	onSelect() {
		const { onSelect, label } = this.props
		if (typeof onSelect === 'function') {
			onSelect(label)
		}
	}

	render() {
		const { label, onSelect, count } = this.props

		return (
			<div className='selectable-label' onClick={this.onSelect}>
				<span className='label-title'>{ label }</span>
				<span className='count'>{ count }</span>
			</div>
		)
	}
}


/**
 * 		@label					  		string of label
 * 		@onSelect							function to call when selecting label
 * 		@count								number of times the label has been used
 */
SelectableLabel.propTypes = {
	label: PropTypes.string.isRequired,
	onSelect: PropTypes.func,
	count: PropTypes.number,
	index: PropTypes.number
}

export default SelectableLabel