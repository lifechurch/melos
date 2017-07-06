import React, { Component } from 'react'
import { connect } from 'react-redux'
import rtlDetect from 'rtl-detect'
import { routeActions } from 'react-router-redux'
import Immutable from 'immutable'
// actions
import subscriptionDayUpdate from '@youversion/api-redux/lib/batchedActions/subscriptionDayUpdate'
import bibleReference from '@youversion/api-redux/lib/batchedActions/bibleReference'
import subscriptionDay from '@youversion/api-redux/lib/batchedActions/subscriptionDay'
// models
import getPlansModel from '@youversion/api-redux/lib/models/readingPlans'
import getSubscriptionModel from '@youversion/api-redux/lib/models/subscriptions'
import getBibleModel from '@youversion/api-redux/lib/models/bible'
// components
import BibleContent from './BibleContent'
import TalkItOver from './TalkItOver'
import PlanReader from '../features/PlanDiscovery/components/planReader/PlanReader'
import PlanDevo from '../features/PlanDiscovery/components/planReader/PlanDevo'
import PlanRef from '../features/PlanDiscovery/components/planReader/PlanRef'
// utils
import { isVerseOrChapter, getBibleVersionFromStorage } from '../lib/readerUtils'
import { isFinalSegment, isFinalPlanDay } from '../lib/readingPlanUtils'
import Routes from '../lib/routes'


class PlanReaderView extends Component {
	constructor(props) {
		super(props)
		this.state = {
			audioPlaying: false,
			showFullChapter: false,
		}
	}

	componentDidMount() {
		const { bible, plan, params: { id, subscription_id }, dispatch } = this.props
		if (!plan) {
			dispatch(subscriptionDay({ plan_id: id.split('-')[0], subscription_id }))
		}
		this.buildData()
	}

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


	componentDidUpdate(prevProps, prevState) {
		const { params: { content }, dispatch } = this.props

		const isNewContent = (typeof content !== 'undefined' &&
													typeof prevProps.params.content !== 'undefined' &&
													content !== prevProps.params.content)

		if (isNewContent) {
			this.buildData()
		}
	}

	onAudioComplete = () => {
		const { dispatch } = this.props

		this.handleComplete()
		dispatch(routeActions.push())
			// if audio has completed a ref then keep it playing for the next one
		this.setState({ audioPlaying: true })
	}

	onComplete = () => {
		const { params: { day, subscription_id, content }, dispatch } = this.props

		dispatch(subscriptionDayUpdate({
			contentIndex: parseInt(content, 10),
			complete: true,
			daySegments: this.daySegments,
			dayProgress: this.dayProgress,
			subscription_id,
			day
		}))
	}

	buildNavLinks() {
		const { params: { content, id, subscription_id, day }, auth } = this.props

		let previous, next, subLink = null
		const username = auth && auth.userData ? auth.userData.username : null
		const subDayLink = Routes.subscriptionDay({
			username,
			plan_id: id ? id.split('-')[0] : null,
			slug: id ? id.split('-')[1] : null,
			subscription_id,
			day
		})
		subLink = Routes.subscription({
			username,
			plan_id: id ? id.split('-')[0] : null,
			slug: id ? id.split('-')[1] : null,
			subscription_id,
		})

		this.contentNum = parseInt(content, 10)
		// figure out nav links for previous
		if (this.contentNum === 0) {
			previous = subDayLink
		} else {
			// previous content
			previous = `${subDayLink}/segment/${this.contentNum - 1}`
		}

		// figure out nav links for next
		if (this.isFinalSegment) {
			if (this.isFinalPlanDay) {
				// plan complete
				next = `${subLink}/completed`
			} else {
				// day complete
				next = `${subDayLink}/completed`
			}
		} else if (this.daySegments && this.contentNum + 1 === this.daySegments.length) {
			// overview page if not last remaining ref, and is last ref in order
			next = subDayLink
		} else {
			// next content
			next = `${subDayLink}/segment/${this.contentNum + 1}`
		}

		return { previous, next, subLink }
	}

	buildData() {
		const { params: { day, content }, plan, subscription } = this.props

		this.daySegments = plan && plan.days && plan.days[day - 1] ?
												plan.days[day - 1].segments :
												null
		this.segment = this.daySegments ?
										this.daySegments[content] :
										null

		this.progressDays = subscription && subscription.days ? subscription.days : null
		this.dayProgress = this.progressDays && this.progressDays[day - 1] ?
												this.progressDays[day - 1] :
												null
		if (this.dayProgress) {
			this.isFinalSegment = this.dayProgress.complete ||
														(
															this.dayProgress.partial &&
															isFinalSegment(content, this.dayProgress.partial)
														)
		}
		this.isFinalPlanDay = isFinalPlanDay(day, this.progressDays)
	}



	render() {
		const { params: { day } } = this.props


		const { previous, next, subLink } = this.buildNavLinks()
		this.buildData()

		let readerContent = null
		if (this.segment) {
			switch (this.segment.kind) {
				case 'devotional':
					readerContent = (
						<PlanDevo devoContent={this.segment.content} />
					)
					break

				case 'reference':
					readerContent = (
						<BibleContent usfm={this.segment.content} />
					)
					break

				case 'talk-it-over':
					readerContent = (
						<TalkItOver content={this.segment.content} day={day} />
					)
					break

				default:
			}
		}

		return (
			<div>
				<PlanReader
					{...this.props}
					previousPath={previous}
					nextPath={next}
					subLink={subLink}
					day={day}
					contentNum={this.contentNum + 1}
					totalSegments={this.daySegments ? this.daySegments.length : null}
					handleContentCheck={this.onComplete}
					showCheckmark={this.isFinalSegment}
					localizedLink={this.localizedLink}
					isRtl={this.isRtl}
				>
					{ readerContent }
				</PlanReader>
			</div>
		)
	}
}

function mapStateToProps(state, props) {
	const { params: { id, subscription_id } } = props
	const plan_id = id.split('-')[0]
	console.log('PLANS', getPlansModel(state))
	return {
		plan: getPlansModel(state) && plan_id in getPlansModel(state).byId ?
					getPlansModel(state).byId[plan_id] :
					null,
		subscription: getSubscriptionModel(state) && subscription_id in getSubscriptionModel(state).byId ?
									getSubscriptionModel(state).byId[subscription_id] :
									null,
		auth: state.auth,
		hosts: state.hosts,
	}
}

export default connect(mapStateToProps, null)(PlanReaderView)
