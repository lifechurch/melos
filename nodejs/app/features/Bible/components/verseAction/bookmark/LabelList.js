import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LabelPill from './LabelPill'

class LabelList extends Component {

	render() {
		const {
			list,
			showHeading,
			onSelect,
			onDelete,
			selectedLabels,
			addedLabels,
			canDelete
		} = this.props

		const labels = []

		if (list) {
			list.forEach((label, index) => {
				// alphabetical sorting contains a group label
				// count does not
				// group headings are set to null if the label's first character has been seen before
				if (showHeading && 'groupHeading' in label && label.groupHeading != null) {
					labels.push(
						<div key={`label-list-heading-${label.groupHeading}`} className='group-heading'>{ label.groupHeading }</div>
					)
				}
				// if our array isn't full of objects
				const labelString = label.label ? label.label : label
				labels.push(
					<LabelPill
						key={labelString}
						label={labelString}
						count={label.count}
						canDelete={canDelete || false}
						onDelete={onDelete ? onDelete.bind(labelString) : null}
						onSelect={onSelect ? onSelect.bind(labelString) : null}
						active={(selectedLabels ? `${labelString}` in selectedLabels : false) || (addedLabels ? `${labelString}` in addedLabels : false)}
					/>
				)
			})
		}

		return (
			<div className='label-list'>
				<div>
					{ labels }
				</div>
			</div>
		)
	}
}


/**
 * 		@list					  		array of list objects formatted:
 * 												{ label: 'labelname', [optionally] count: 3, [optionally] groupHeading: 'a' }
 */
LabelList.propTypes = {
	list: PropTypes.array,
	showHeading: PropTypes.bool,
	onSelect: PropTypes.func,
	selectedLabels: PropTypes.object
}

export default LabelList
