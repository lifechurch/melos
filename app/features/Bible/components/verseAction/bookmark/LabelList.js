import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import ActionCreators from '../../../actions/creators'
import LabelPill from './LabelPill'

class LabelList extends Component {

	constructor(props) {
		super(props)
		this.state = {
			filterBy: 'alphabetical',
			selectedLabels: {},
			selected: 0
		}

		this.addLabel = this.addLabel.bind(this)
		this.onSelect = this.onSelect.bind(this)
	}

	addLabel() {

	}

	onSelect(index) {
		const { selectedLabels, selected } = this.state

		if (`${index}` in selectedLabels) {
			// if the toggled label is now true
			if (!selectedLabels[index]) {
				this.setState({ selected: selected + 1 })
			} else {
				this.setState({ selected: selected - 1 })
			}
			this.setState({ selectedLabels: Object.assign(selectedLabels, { [index]: !selectedLabels[index]}) })
		} else {
			this.setState({
				selectedLabels: Object.assign(selectedLabels, { [index]: true }),
				selected: selected + 1
			})
		}
	}

	render() {
		const { byCount, byAlphabetical } = this.props
		const { filterBy, selectedLabels, selected } = this.state

		let labels = []

		if (byAlphabetical && filterBy == 'alphabetical') {
			byAlphabetical.forEach((label, index) => {
				// alphabetical sorting contains a group label
				// count does not
				if ('group' in label && label.group != null) {
					labels.push (
						<h4 className='group-heading'>{ label.group }</h4>
					)
				}
				labels.push (
					<LabelPill
						label={label.label}
						count={label.count}
						canDelete={false}
						onSelect={this.onSelect}
						index={index}
						active={selectedLabels[index]}
					/>
				)
			})

		} else if (byCount && filterBy == 'count') {
			byCount.forEach((label, index) => {
				labels.push (
					<LabelPill
						label={label.label}
						count={label.count}
						canDelete={false}
						onSelect={this.onSelect}
						index={index}
						active={selectedLabels[index]}
					/>
				)
			})
		}

		return (
			<div className='labels-modal'>
				<div className='header vertical-center'>
					<a className='cancel columns medium-4' onClick={() => {}}><FormattedMessage id="Reader.header.cancel" /></a>
					<p className='title columns medium-4'><FormattedMessage id="Reader.labels" /></p>
					<a className='add columns medium-4' onClick={this.addLabel}><FormattedMessage id="Reader.add" />{selected > 0 ? `(${selected})` : null}</a>
				</div>
				<div className='label-list'>
					{ labels }
				</div>
				<div className='footer'>
					<div className={`filter-button vertical-center ${filterBy == 'alphabetical' ? 'active-button' : ''}`} onClick={() => this.setState({ filterBy: 'alphabetical' })}><FormattedMessage id='Reader.alphabetical' /></div>
					<div className={`filter-button vertical-center ${filterBy == 'count' ? 'active-button' : ''}`} onClick={() => this.setState({ filterBy: 'count' })}><FormattedMessage id="Reader.count" /></div>
					<div className='labels-privacy vertical-center'><FormattedMessage id='Reader.labels.private' /></div>
				</div>
			</div>
		)
	}
}

LabelList.propTypes = {

}

export default LabelList