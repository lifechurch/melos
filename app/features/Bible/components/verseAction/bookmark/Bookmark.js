import React, { Component, PropTypes } from 'react'
import ActionCreators from '../../../actions/creators'
import { FormattedMessage } from 'react-intl'
import XMark from '../../../../../components/XMark'

class Bookmark extends Component {

	componentDidMount() {
		const { isLoggedIn } = this.props
		// redirect to sign in page
		if (!isLoggedIn) {
			window.location.replace('/sign-in')
		}


	}

	render() {
		return (
			<div className='bookmark-create'>
				<div className='heading row'>
					<div className='columns medium-4'><XMark width={18} height={18} /></div>
					<div className=''><FormattedMessage id='bookmark' /></div>
					<div className='solid-button padded green'>Save</div>
				</div>
			</div>
		)
	}
}

Bookmark.propTypes = {

}

export default Bookmark