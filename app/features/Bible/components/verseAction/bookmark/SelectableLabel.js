import React, { Component, PropTypes } from 'react'


class SelectableLabel extends Component {

	constructor(props) {
		super(props)

		this.onSelect = ::this.onSelect
	}

	onSelect() {
		const { onSelect, label } = this.props
		if (typeof onSelect == 'function') {
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
	label: React.PropTypes.string.isRequired,
	onSelect: React.PropTypes.func,
	count: React.PropTypes.number,
	index: React.PropTypes.number
}

export default SelectableLabel