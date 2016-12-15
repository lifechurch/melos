import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import ActionCreators from '../../../actions/creators'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
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

		let labels = []

		if (list) {
			list.forEach((label, index) => {
				// alphabetical sorting contains a group label
				// count does not
				// group headings are set to null if the label's first character has been seen before
				if (showHeading && 'groupHeading' in label && label.groupHeading != null) {
					labels.push (
						<div key={`label-list-heading-${label.groupHeading}`} className='group-heading'>{ label.groupHeading }</div>
					)
				}
				// if our array isn't full of objects
				let labelString = label.label ? label.label : label
				labels.push (
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
        <ReactCSSTransitionGroup
          transitionName="label"
          transitionAppear={true}
      		transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>
					{ labels }
        </ReactCSSTransitionGroup>
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