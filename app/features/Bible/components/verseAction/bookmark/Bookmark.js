import React, { Component, PropTypes } from 'react'
import ActionCreators from '../../../actions/creators'
import { FormattedMessage } from 'react-intl'
import moment from 'moment-timezone'
import XMark from '../../../../../components/XMark'
import VerseCard from './VerseCard'
import LabelSelector from './LabelSelector'

class Bookmark extends Component {

	constructor(props) {
		super(props)
		this.state = {
			labels: {}
		}

		this.updateLabels = this.updateLabels.bind(this)
		this.saveBookMark = ::this.saveBookMark
	}

	componentDidMount() {
		const { isLoggedIn } = this.props
		// redirect to sign in page
		if (!isLoggedIn) {
			window.location.replace('/sign-in')
		}
	}

	updateLabels(labels) {
		this.setState({
			labels: Object.keys(labels),
		})
	}

	saveBookMark() {
		const { dispatch, isLoggedIn, verseContent } = this.props
		const { labels } = this.state
		dispatch(ActionCreators.momentsCreate(isLoggedIn, {
			kind: 'bookmark',
			references: verseContent.references,
			labels: labels,
			created_dt: moment().format(),
		}))
	}


	render() {
		const { verseContent, labels } = this.props

		return (
			<div className='bookmark-create'>
				<div className='row large-6'>
					<div className='heading vertical-center'>
						<div className='columns medium-4 cancel'><XMark width={18} height={18} /></div>
						<div className='columns medium-4 title'><FormattedMessage id='bookmark' /></div>
						<div className='columns medium-4 save'>
							<div onClick={this.saveBookMark} className='solid-button green'>Save</div>
						</div>
					</div>
					<VerseCard verses={verseContent.verses}>
						<LabelSelector byAlphabetical={labels.byAlphabetical} byCount={labels.byCount} updateLabels={this.updateLabels} />
					</VerseCard>
				</div>
			</div>
		)
	}
}

Bookmark.propTypes = {

}

export default Bookmark