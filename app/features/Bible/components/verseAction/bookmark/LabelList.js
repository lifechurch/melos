import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import ActionCreators from '../../../actions/creators'
import LabelPill from './LabelPill'

class LabelList extends Component {

	render() {
		const {
			list,
			showHeading,
			sortBy,
			onSelect,
			selectedLabels
		} = this.props

		let labels = []

		if (list && sortBy == 'alphabetical') {
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
						canDelete={false}
						onSelect={onSelect.bind(label.label)}
						active={selectedLabels[label.label]}
					/>
				)
			})

		} else if (list && sortBy == 'count') {
			list.forEach((label, index) => {
				labels.push (
					<LabelPill
						label={label.label}
						count={label.count}
						canDelete={false}
						onSelect={onSelect.bind(label.label)}
						active={selectedLabels[label.label]}
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

LabelList.propTypes = {
	list: React.PropTypes.array,
	addLabels: React.PropTypes.func,
	showHeading: React.PropTypes.bool,
	sortBy: React.PropTypes.oneOf(['alphabetical', 'count']),
	onSelect: React.PropTypes.func,
	selectedLabels: React.PropTypes.object
}

export default LabelList