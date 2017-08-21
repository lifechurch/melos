import React, { Component } from 'react'
import { connect } from 'react-redux'
import rtlDetect from 'rtl-detect'
import { routeActions } from 'react-router-redux'
import Immutable from 'immutable'
// actions
import subscriptionData, { subscriptionDayUpdate } from '@youversion/api-redux/lib/batchedActions/subscriptionData'
import bibleReference from '@youversion/api-redux/lib/batchedActions/bibleReference'
// models
import getPlansModel from '@youversion/api-redux/lib/models/readingPlans'
import getSubscriptionModel from '@youversion/api-redux/lib/models/subscriptions'
import getBibleModel from '@youversion/api-redux/lib/models/bible'
// components
import BibleWidget from './BibleWidget'
import TalkItOver from './TalkItOver'
import PlanReader from '../features/PlanDiscovery/components/planReader/PlanReader'
import PlanDevo from '../features/PlanDiscovery/components/planReader/PlanDevo'
import PlanRef from '../features/PlanDiscovery/components/planReader/PlanRef'
// utils
import { isVerseOrChapter, getBibleVersionFromStorage, getReferencesTitle } from '../lib/readerUtils'
import { isFinalSegmentToComplete, isFinalPlanDay } from '../lib/readingPlanUtils'
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
		const { bible, plan, params: { subscription_id, day }, dispatch, auth } = this.props
		if (!plan) {
			dispatch(subscriptionData({ subscription_id, auth, day }))
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

		const isNewContent = typeof content !== 'undefined'
			&& typeof prevProps.params.content !== 'undefined'
			&& content !== prevProps.params.content

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
		const { params: { day, subscription_id }, dispatch } = this.props

		const isPlanComplete = this.isFinalSegmentToComplete && this.isFinalPlanDay

		dispatch(subscriptionDayUpdate({
			contentIndex: this.contentNum,
			complete: true,
			daySegments: this.daySegments,
			dayProgress: this.dayProgress,
			subscription_id,
			day,
			isPlanComplete,
		}))
	}

	buildNavLinks() {
		const { params: { content, id, subscription_id, day }, auth } = this.props

		let previous, next, subLink = null
		const username = auth && auth.userData ? auth.userData.username : null
		const plan_id = id ? id.split('-')[0] : null
		const slug = id ? id.split('-')[1] : null
		const subDayLink = Routes.subscriptionDay({
			username,
			plan_id,
			slug,
			subscription_id,
			day
		})
		subLink = Routes.subscription({
			username,
			plan_id,
			slug,
			subscription_id,
		})

		// figure out nav links for previous
		if (this.contentNum === 0) {
			previous = subDayLink
		} else {
			// previous content
			previous = `${subDayLink}/segment/${this.contentNum - 1}`
		}

		// figure out nav links for next
		// if this is the last segment, do we go to day complete, plan complete or
		// just the overview page?
		if (this.isLastSegment) {
			// completed days' reading for first time
			if (this.isFinalSegmentToComplete && !this.dayProgress.complete) {
				// plan complete
				if (this.isFinalPlanDay) {
					next = Routes.subscriptionComplete({
						username,
						plan_id,
						slug,
					})
				} else {
					// day complete
					next = `${subDayLink}/completed`
				}
			// overview page if already completed
			} else {
				next = subDayLink
			}
		} else {
			// next content
			next = `${subDayLink}/segment/${this.contentNum + 1}`
		}

		return { previous, next, subLink }
	}

	buildData() {
		const { params: { day, content }, plan, subscription } = this.props

		this.contentNum = parseInt(content, 10)

		this.daySegments = plan
			&& plan.days
			&& plan.days[day]
			? plan.days[day].segments
			: null
		this.segment = this.daySegments
			? this.daySegments[this.contentNum]
			: null

		this.progressDays = subscription && subscription.days ? subscription.days : null
		this.dayProgress = this.progressDays
			&& this.progressDays[day]
			? this.progressDays[day]
			: null
		if (this.dayProgress) {
			this.isFinalSegmentToComplete = this.dayProgress.partial &&
				isFinalSegmentToComplete(content, this.dayProgress.partial)
		}

		this.isLastSegment = this.daySegments && (this.contentNum + 1 >= this.daySegments.length)
		this.isFinalPlanDay = isFinalPlanDay(day, this.progressDays)
	}



	render() {
		const { params: { day }, dispatch, plan, subscription } = this.props

		this.buildData()
		const { previous, next, subLink } = this.buildNavLinks()

		let customClass = null
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
						<BibleWidget
							customHeaderClass='plan-reader-heading'
							usfm={this.segment.content}
						/>
					)
					break

				case 'talk-it-over':
					customClass = 'gray-background'
					readerContent = (
						<TalkItOver
							together_id={subscription ? subscription.together_id : null}
							content={this.segment.content}
							day={day}
						/>
					)
					break

				default:
			}
		}

		return (
			<div>
				<PlanReader
					customClass={customClass}
					previousPath={previous}
					nextPath={next}
					subLink={subLink}
					day={day}
					contentNum={this.contentNum + 1}
					totalSegments={this.daySegments ? this.daySegments.length : null}
					handleContentCheck={this.onComplete}
					showCheckmark={this.isLastSegment && this.isFinalSegmentToComplete}
					localizedLink={this.localizedLink}
					isRtl={this.isRtl}
					plan={plan}
					dispatch={dispatch}
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
	console.log('SUB', getSubscriptionModel(state))
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
