import React, { Component } from 'react'
import PropTypes from 'prop-types'
import XMark from '../../../../../components/XMark'
import SelectableLabel from './SelectableLabel'
import DeletableLabel from './DeletableLabel'

class LabelPill extends Component {

	render() {
		const { label, count, onSelect, canDelete, onDelete, active } = this.props

		let labelPill, classes = null

		if (label) {
			if (canDelete) {
				classes = (active) ? 'label-pill active' : 'label-pill'
				labelPill = <DeletableLabel label={label} onDelete={onDelete} />
			} else {
				classes = (active) ? 'label-pill selectable active' : 'label-pill selectable'
				labelPill = <SelectableLabel label={label} onSelect={onSelect} count={count} />
			}
		}

		return (
			<div className={classes}>
				{ labelPill }
			</div>
		)
	}
}


/**
 * 		@label					  		string of label
 * 		@count	   						number of times this label has been used
 * 		@onSelect			  			function to call when selecting label
 * 		@canDelete						bool for rendering delete label or select label
 * 		@onDelete							function to call when deleting label
 * 		@active								bool for determining if label is actively selected
 */
LabelPill.propTypes = {
	label: PropTypes.string.isRequired,
	count: PropTypes.number,
	onSelect: PropTypes.func,
	canDelete: PropTypes.bool,
	onDelete: PropTypes.func,
	active: PropTypes.bool
}

export default LabelPill