import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import Image from '../../../components/Carousel/Image'
import SubscribeUserDialog from '../../PlanDiscovery/components/SubscribeUserDialog'

class SubscribeUserView extends Component {

	render() {
		const { readingPlan, auth } = this.props

		return (
			<div className='row horizontal-center'>
				<div className='columns large-8 text-center'>

					<h6><FormattedMessage id='plans.start'/></h6>

					<a href={readingPlan.short_url}>
						<Image width={320} height={180} thumbnail={false} imageId="false" type="about_plan" config={readingPlan} />
					</a>

					<br/>

					<div style={ {"marginTop": '15px'} }>
						<h3>
							<a href={readingPlan.short_url}>{ readingPlan.name[auth.userData.language_tag] || readingPlan.name.default }</a>
						</h3>

						<hr/>

						<SubscribeUserDialog {...this.props} />
					</div>

				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		auth: (state.auth),
		readingPlan: (state.plansDiscovery && state.plansDiscovery.plans) ? state.plansDiscovery.plans : {}
	}
}

export default connect(mapStateToProps, null)(SubscribeUserView)