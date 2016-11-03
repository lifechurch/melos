import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import ActionCreators from '../../../actions/creators'
import LabelList from './LabelList'

class LabelsModal extends Component {

	constructor(props) {
		super(props)
		this.state = {
			filterBy: 'alphabetical'
		}

		this.addLabel = this.addLabel.bind(this)
		this.onSelect = this.onSelect.bind(this)
	}

	addLabel() {
		const { addLabels } = this.props
		const { selectedLabels } = this.state

		addLabels(selectedLabels)
	}



	render() {
		const { byCount, byAlphabetical, cancelDropDown } = this.props
		const { filterBy, selectedLabels, selected } = this.state

		let labels = null

		if (byAlphabetical && filterBy == 'alphabetical') {
			labels = <LabelList list={byAlphabetical} sortBy={'alphabetical'} showHeading={true} onSelect={this.onSelect} selectedLabels={selectedLabels} />
		} else if (byCount && filterBy == 'count') {
			labels = <LabelList list={byCount} sortBy={'count'} onSelect={this.onSelect} selectedLabels={selectedLabels} />
		}

		return (
			<div className='labels-modal'>
				<div className='header vertical-center'>
					<a className='cancel columns medium-4' onClick={cancelDropDown}><FormattedMessage id="Reader.header.cancel" /></a>
					<p className='title columns medium-4'><FormattedMessage id="Reader.labels" /></p>
					<a className='add columns medium-4' onClick={this.addLabel}><FormattedMessage id="Reader.add" />{selected > 0 ? `(${selected})` : null}</a>
				</div>
				{ labels }
				<div className='footer'>
					<div className={`filter-button vertical-center ${filterBy == 'alphabetical' ? 'active-button' : ''}`} onClick={() => this.setState({ filterBy: 'alphabetical' })}><FormattedMessage id='Reader.alphabetical' /></div>
					<div className={`filter-button vertical-center ${filterBy == 'count' ? 'active-button' : ''}`} onClick={() => this.setState({ filterBy: 'count' })}><FormattedMessage id="Reader.count" /></div>
					<div className='labels-privacy vertical-center'><FormattedMessage id='Reader.labels.private' /></div>
				</div>
			</div>
		)
	}
}

LabelsModal.propTypes = {
	byCount: React.PropTypes.array,
	byAlphabetical: React.PropTypes.array,
	addLabels: React.PropTypes.func
}

export default LabelsModal