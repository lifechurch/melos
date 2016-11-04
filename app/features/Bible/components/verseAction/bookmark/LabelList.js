import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import ActionCreators from '../../../actions/creators'
import LabelPill from './LabelPill'

class LabelList extends Component {

	render() {
		const {
			list,
			showHeading,
			onSelect,
			onDelete,
			selectedLabels,
			canDelete
		} = this.props

		let labels = []

		if (list) {
			list.forEach((label, index) => {
				// alphabetical sorting contains a group label
				// count does not
				// group headings are set to null if the label's first character has been seen before
				if (showHeading && 'groupHeading' in label && label.groupHeading != null) {
					labels.push (
						<div className='group-heading'>{ label.groupHeading }</div>
					)
				}
				labels.push (
					<LabelPill
						label={label.label}
						count={label.count}
						canDelete={canDelete || false}
						onDelete={onDelete ? onDelete.bind(label.label) : null}
						onSelect={onSelect ? onSelect.bind(label.label) : null}
						active={selectedLabels ? selectedLabels[label.label] : false}
					/>
				)
			})
		}

		return (
			<div className='label-list'>
				{ labels }
			</div>
		)
	}
}


/**
 * 		@list					  		array of list objects formatted:
 * 												{ label: 'labelname', [optionally] count: 3, [optionally] groupHeading: 'a' }
 */
LabelList.propTypes = {
	list: React.PropTypes.array,
	showHeading: React.PropTypes.bool,
	onSelect: React.PropTypes.func,
	selectedLabels: React.PropTypes.object
}

export default LabelList