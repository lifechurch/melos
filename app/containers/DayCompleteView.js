import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { FormattedMessage } from 'react-intl'
import rtlDetect from 'rtl-detect'
import StackedContainer from '../components/StackedContainer'
import CheckMark from '../components/CheckMark'
import ProgressBar from '../components/ProgressBar'
import Share from '../features/Bible/components/verseAction/share/Share'

class DayCompleteView extends Component {

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
		const { params: { id, day }, plans, auth } = this.props
		const plan = plans[id.split('-')[0]]
		if (!plan) return <div />

		const backImgStyle = {
			backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${plan.images[4].url})`
		}

		const nextLink = 	(parseInt(day, 10) + 1) <= plan.total_days ?
								`/users/${auth.userData.username}/reading-plans/${plan.id}-${plan.slug}/day/${parseInt(day, 10) + 1}` :
								`/users/${auth.userData.username}/reading-plans/${plan.id}-${plan.slug}/day/1`
		return (
			<div className='rp-completed-view'>
				<div className='completed-header'>
					<h6 className='horizontal-center'>
						<FormattedMessage id="plans.day complete" />
					</h6>
					<div className='plan-length-header horizontal-center'>
						<FormattedMessage id="plans.which day in plan" values={{ day, total: plan.total_days }} />
					</div>
				</div>
				<StackedContainer width={'100%'} height={'380px'}>
					<div className='parallax-back-img' style={backImgStyle} />
					<div className='content columns large-8 medium-8 horizontal-center'>
						<div className='row horizontal-center vertical-center'>
							<Link to={this.localizedLink(nextLink)} className='circle-buttons vertical-center horizontal-center'>
								<CheckMark fill='#6ab750' width={27} height={26} />
							</Link>
						</div>
						<div className='row horizontal-center vertical-center'>
							<img alt='reading plan' src={plan.images[7].url} height={160} width={310} />
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
								url={this.localizedLink(`${window.location.origin}/reading-plans/${plan.id}-${plan.slug}/day/${day}/completed?user_id=${auth.userData.userid}`)}
								button={
									<button className='solid-button share-button'>
										<FormattedMessage id='features.EventEdit.components.EventEditNav.share' />
									</button>
							}
							/> :
						null
					}
				</div>
				<div className='row horizontal-center vertical-center'>
					<Link to={this.localizedLink(`/users/${auth.userData.username}/reading-plans`)} className='small-font'>
						<FormattedMessage id="plans.widget.view my plans" />
					</Link>
					&nbsp;
					&bull;
					&nbsp;
					<Link to={this.localizedLink(nextLink)} className='small-font'>
						<FormattedMessage id="plans.next" />
						&rarr;
					</Link>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		plans: state.readingPlans && state.readingPlans.fullPlans && state.readingPlans.fullPlans ? state.readingPlans.fullPlans : null,
		auth: state.auth,
		hosts: state.hosts,
		serverLanguageTag: state.serverLanguageTag
	}
}

export default connect(mapStateToProps, null)(DayCompleteView)
