import React, { Component, PropTypes } from 'react'
import ActionCreators from '../../../actions/creators'
import { FormattedMessage } from 'react-intl'
import XMark from '../../../../../components/XMark'
import VerseCard from './VerseCard'

class Bookmark extends Component {

	componentDidMount() {
		const { isLoggedIn } = this.props
		// redirect to sign in page
		if (!isLoggedIn) {
			window.location.replace('/sign-in')
		}


	}

	render() {
		const { verseContent } = this.props

		return (
			<div className='bookmark-create'>
				<div className='heading row vertical-center horizontal-center'>
					<div className='columns medium-4 cancel'><XMark width={18} height={18} /></div>
					<div className='columns medium-4 title'><FormattedMessage id='bookmark' /></div>
					<div className='columns medium-4 save'><div className='solid-button green'>Save</div></div>
				</div>
				<div className='row'>
					<VerseCard verses={verseContent} />
				</div>
			</div>
		)
	}
}

Bookmark.propTypes = {

}

export default Bookmark