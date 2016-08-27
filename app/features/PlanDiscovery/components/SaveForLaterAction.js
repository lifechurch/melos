import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import ActionCreators from '../actions/creators'
import { Link } from 'react-router'
import CheckMark from '../../../components/CheckMark'

class SaveForLaterAction extends Component {

	saveForLater(id) {
		const { dispatch, auth } = this.props

		if (this.props.readingPlan.saved) {
			dispatch(ActionCreators.readingplanRemoveSave({ id: id }, auth.isLoggedIn))
		} else {
			dispatch(ActionCreators.readingplanSaveforlater({ id: id }, auth.isLoggedIn))
		}
	}

	render() {
		const { readingPlan } = this.props

		var button = this.props.button || false

		if (readingPlan.saved) {
			if (button) {
				var saveforlater = <a className='save-for-later button' onClick={this.saveForLater.bind(this, readingPlan.id)}><CheckMark /><FormattedMessage id="plans.saved for later" /> </a>
			} else {
				var saveforlater = <a className='save-for-later' onClick={this.saveForLater.bind(this, readingPlan.id)}><CheckMark /><FormattedMessage id="plans.saved for later" /> </a>
			}
		} else {
			if (button) {
				var saveforlater = <a className='save-for-later button' onClick={this.saveForLater.bind(this, readingPlan.id)}><FormattedMessage id="plans.save for later" /> </a>
			} else {
				var saveforlater = <a className='save-for-later' onClick={this.saveForLater.bind(this, readingPlan.id)}><FormattedMessage id="plans.save for later" /> </a>
			}
		}

		return (
			<div className='checkmark-container'>
				{ saveforlater }
				&nbsp;
			</div>
		)
	}
}

export default SaveForLaterAction