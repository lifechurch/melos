import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import rtlDetect from 'rtl-detect'
import StackedContainer from '../components/StackedContainer'
import CheckMark from '../components/CheckMark'
import ProgressBar from '../components/ProgressBar'
import Share from '../features/Bible/components/verseAction/share/Share'

class SharedDayCompleteView extends Component {

	localizedLink = (link) => {
		const { params, serverLanguageTag } = this.props
		const languageTag = serverLanguageTag || params.lang || 'en'

		if (['en', 'en-US'].indexOf(languageTag) > -1) {
			return link
		} else {
			return `/${languageTag}${link}`
		}
	}

	isRtl = () => {
		const { params, serverLanguageTag } = this.props
		const languageTag = params.lang || serverLanguageTag || 'en'
		return rtlDetect.isRtlLang(languageTag)
	}

	render() {
		const { params: { id, day }, plans, users } = this.props
		let plan = null
		let userData = null

		try {
			plan = plans[id.split('-')[0]]
		} catch (ex) {
			return <div />
		}
		// if for some reason the user view call failed, let's just display without name
		try {
			userData = users[Object.keys(users)[0]]
		} catch (ex) {

		}

		const backImgStyle = {
			backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${plan.images ? plan.images[4].url : 'https://s3.amazonaws.com/yvplans-staging/default/720x405.jpg'})`
		}

		return (
			<div className='rp-completed-view'>
				<div className='completed-header'>
					<h6 className='horizontal-center'>
						<FormattedHTMLMessage id="plans.day_completed" values={{ username: userData ? userData.name : '', day, plan_title: plan.name.default }} />
					</h6>
					<div className='plan-length-header horizontal-center'>
						<FormattedMessage id="plans.which day in plan" values={{ day, total: plan.total_days }} />
					</div>
				</div>
				<StackedContainer width={'100%'} height={'380px'}>
					<div className='parallax-back-img' style={backImgStyle} />
					<div className='content columns large-8 medium-8 horizontal-center'>
						<div className='row horizontal-center vertical-center'>
							<div className='circle-buttons vertical-center horizontal-center'>
								<CheckMark fill='#6ab750' width={27} height={26} />
							</div>
						</div>
						<div className='row horizontal-center vertical-center'>
							<img alt='reading plan' src={plan.images ? plan.images[7].url : 'https://s3.amazonaws.com/yvplans-staging/default/720x405.jpg'} height={160} width={310} />
						</div>
						<div className='row horizontal-center vertical-center'>
							<ProgressBar percentComplete={plan.completion_percentage} width={'250px'} height={'10px'} />
						</div>
					</div>
				</StackedContainer>
				<div className='row horizontal-center vertical-center'>
					{
						typeof window !== 'undefined' ?
							<Share
								text={plan.name.default}
								button={
									<button className='solid-button share-button'>
										<FormattedMessage id='features.EventEdit.components.EventEditNav.share' />
									</button>
							}
							/> :
						null
					}
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		plans: state.readingPlans && state.readingPlans.fullPlans && state.readingPlans.fullPlans ? state.readingPlans.fullPlans : null,
		users: state.users && state.users.view ? state.users.view : null,
		hosts: state.hosts,
		serverLanguageTag: state.serverLanguageTag
	}
}

export default connect(mapStateToProps, null)(SharedDayCompleteView)
