import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'

import ActionCreators from '../actions/creators'
import CheckMark from '../../../components/CheckMark'

class SaveForLaterAction extends Component {
	constructor(props) {
		super(props)
		this.handleSaveForLater = this.handleSaveForLater.bind(this)
	}

	handleSaveForLater() {
		const { dispatch, isLoggedIn, isSaved, id } = this.props
		const planSelect = () => {
			dispatch(ActionCreators.planSelect({ id }))
		}

		if (!isLoggedIn) window.location.replace('/sign-in')
		if (isSaved) {
			dispatch(ActionCreators.readingplanRemoveSave({ id }, isLoggedIn)).then(planSelect)
		} else {
			dispatch(ActionCreators.readingplanSaveforlater({ id }, isLoggedIn)).then(planSelect)
		}
	}

	render() {
		const { isSaved, isButton } = this.props
		return (
			<div className='checkmark-container'>
				<a
					tabIndex={0}
					className={`save-for-later ${isButton ? 'button' : ''}`}
					onClick={this.handleSaveForLater}
				>
					{isSaved && <CheckMark width={15} height={15} />}
					{isSaved
						? <FormattedMessage id="plans.saved for later" />
						: <FormattedMessage id="plans.save for later" />
					}
				</a>
				&nbsp;
			</div>
		)
	}
}

SaveForLaterAction.propTypes = {
	dispatch: PropTypes.func.isRequired,
	isLoggedIn: PropTypes.bool.isRequired,
	isSaved: PropTypes.bool.isRequired,
	isButton: PropTypes.bool,
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
}

SaveForLaterAction.defaultProps = {
	isButton: false
}

function mapStateToProps(state) {
	return {
		isLoggedIn: state.auth.isLoggedIn
	}
}

export default connect(mapStateToProps)(SaveForLaterAction)
