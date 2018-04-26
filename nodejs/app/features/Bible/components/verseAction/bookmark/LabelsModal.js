import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import ActionCreators from '../../../actions/creators'
import LabelList from './LabelList'
import CustomScroll from 'react-custom-scroll'


class LabelsModal extends Component {

	constructor(props) {
		super(props)
		this.state = {
			filterBy: 'alphabetical'
		}
	}

	render() {
		const {
			byCount,
			byAlphabetical,
			addLabels,
			selectedLabels,
			addedLabels,
			selected,
			cancelDropDown,
			onSelect
		} = this.props
		const { filterBy } = this.state

		let labels = null

		if (byAlphabetical && filterBy == 'alphabetical' && byAlphabetical.length > 0) {
			labels = <LabelList list={byAlphabetical} showHeading={true} onSelect={onSelect} selectedLabels={selectedLabels} addedLabels={addedLabels} />
		} else if (byCount && filterBy == 'count' && byCount.length > 0) {
			labels = <LabelList list={byCount} onSelect={onSelect} selectedLabels={selectedLabels} addedLabels={addedLabels} />
		} else {
			labels = (
				<div className='label-list'>
					<FormattedMessage id='Reader.verse action.no labels' />
				</div>
			)
		}

		return (
			<div className='labels-modal'>
				<div className='header vertical-center'>
					<a className='cancel columns medium-4' onClick={cancelDropDown}><FormattedMessage id="Reader.header.cancel" /></a>
					<p className='title columns medium-4'><FormattedMessage id="Reader.verse action.labels" /></p>
					<a className={`add columns medium-4 ${selected > 0 ? 'yv-green-link' : 'yv-gray-link'}`} onClick={addLabels}><FormattedMessage id="Reader.verse action.add with count" values={{ count: selected }} /></a>
				</div>
				<CustomScroll allowOutsideScroll={false}>
					{ labels }
				</CustomScroll>
				<div className='footer'>
					<div className={`filter-button vertical-center ${filterBy == 'alphabetical' ? 'active-button' : ''}`} onClick={() => { return this.setState({ filterBy: 'alphabetical' }) }}><FormattedMessage id='Reader.verse action.alphabetical' /></div>
					<div className={`filter-button vertical-center ${filterBy == 'count' ? 'active-button' : ''}`} onClick={() => { return this.setState({ filterBy: 'count' }) }}><FormattedMessage id="Reader.verse action.count" /></div>
					<div className='labels-privacy vertical-center'><FormattedMessage id='Reader.verse action.labels private' /></div>
				</div>
			</div>
		)
	}
}

LabelsModal.propTypes = {
	byCount: PropTypes.array,
	byAlphabetical: PropTypes.array,
	addLabels: PropTypes.func
}

export default LabelsModal