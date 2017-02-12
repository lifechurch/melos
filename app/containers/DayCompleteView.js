import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import StackedContainer from '../components/StackedContainer'
import CheckMark from '../components/CheckMark'
import ProgressBar from '../components/ProgressBar'
import PlanReader from '../features/PlanDiscovery/components/planReader/PlanReader'

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
		let plan = null
		try {
			plan = plans[id.split('-')[0]]
		} catch (e) {
			return <div />
		}

		const backImgStyle = {
			backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${plan.images[4].url})`
		}

		return (
			<div className='rp-completed-view'>
				<div className='completed-header'>
					Day Completed
				</div>
				<StackedContainer width={'100%'} height={'360px'}>
					<div className='parallax-back-img' style={backImgStyle} />
					<div className='columns large-8 medium-8 medium-centered text-center'>
						{
							auth.isLoggedIn ?
								<Link to={'/'} className='circle-buttons vertical-center horizontal-center'>
									<CheckMark fill='#6ab750' width={27} height={26} />
								</Link> :
								<div className='circle-buttons vertical-center horizontal-center'>
									<CheckMark fill='#6ab750' width={27} height={26} />
								</div>
						}
						<img alt='reading plan' src={plan.images[7].url} height={160} width={360} />
						<ProgressBar percentComplete={plan.completion_percentage} />
					</div>
				</StackedContainer>
				<div>some stuff!</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		plans: state.readingPlans && state.readingPlans.fullPlans && state.readingPlans.fullPlans ? state.readingPlans.fullPlans : null,
		auth: state.auth,
		hosts: state.hosts,
	}
}

export default connect(mapStateToProps, null)(DayCompleteView)
