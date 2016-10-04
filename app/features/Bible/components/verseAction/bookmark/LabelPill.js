import React, { Component, PropTypes } from 'react'
import XMark from '../../../../../components/XMark'
import SelectableLabel from './SelectableLabel'
import DeletableLabel from './DeletableLabel'

class LabelPill extends Component {

	render() {
		const { label, count, onSelect, canDelete, onDelete, active } = this.props

		let labelPill,classes = null

		if (label) {
			if (canDelete) {
				classes = (active) ? 'label-pill vertical-center active' : 'label-pill vertical-center'
				labelPill = <DeletableLabel label={label} onDelete={onDelete} />
			} else {
				classes = (active) ? 'label-pill selectable vertical-center active' : 'label-pill selectable vertical-center'
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
	label: React.PropTypes.string.isRequired,
	count: React.PropTypes.number,
	onSelect: React.PropTypes.func,
	canDelete: React.PropTypes.bool,
	onDelete: React.PropTypes.func,
	active: React.PropTypes.bool
}

export default LabelPill