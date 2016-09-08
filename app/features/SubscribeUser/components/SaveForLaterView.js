import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import CheckMark from '../../../components/CheckMark'

class SaveForLaterView extends Component {

	render() {
		const { readingPlan, auth } = this.props

		return (
			<div className='row horizontal-center'>
				<CheckMark height={50} width={50} />

				<h3>
					<a href={readingPlan.short_url}>{ readingPlan.name[auth.userData.language_tag] || readingPlan.name.default }</a>
					&nbsp;
					<FormattedMessage id="plans.saved for later" />
				</h3>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		auth: (state.auth),
		readingPlan: (state.saveForLater && state.saveForLater.plans) ? state.saveForLater.plans : {}
	}
}

export default connect(mapStateToProps, null)(SaveForLaterView)