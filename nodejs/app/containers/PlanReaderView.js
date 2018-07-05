import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import rtlDetect from 'rtl-detect'
import { push } from 'react-router-redux'
import isFinalSegmentToComplete from '@youversion/utils/lib/readingPlans/isFinalSegmentToComplete'
import isFinalPlanDay from '@youversion/utils/lib/readingPlans/isFinalPlanDay'
import mapTioIndices from '@youversion/utils/lib/readingPlans/mapTIOIndices'
// actions
import subscriptionData, { subscriptionDayUpdate } from '@youversion/api-redux/lib/batchedActions/subscriptionData'
// models
import getPlansModel from '@youversion/api-redux/lib/models/readingPlans'
import getSubscriptionModel from '@youversion/api-redux/lib/models/subscriptions'
// components
import BibleWidget from './BibleWidget'
import TalkItOver from './TalkItOver'
import PlanReader from '../features/PlanDiscovery/components/planReader/PlanReader'
import PlanDevo from '../features/PlanDiscovery/components/planReader/PlanDevo'
// utils
import Routes from '@youversion/utils/lib/routes/routes'


class PlanReaderView extends Component {
	constructor(props) {
		super(props)
		this.state = {
			audioPlaying: false,
			showFullChapter: false,
		}
	}

	componentDidMount() {
		const { plan, params: { subscription_id, day }, dispatch, auth } = this.props
		if (!plan) {
			dispatch(subscriptionData({ subscription_id, auth, day }))
		}
		this.buildData()
	}

	componentDidUpdate(prevProps) {
		const { params: { content } } = this.props

		const isNewContent = typeof content !== 'undefined'
			&& typeof prevProps.params.content !== 'undefined'
			&& content !== prevProps.params.content

		if (isNewContent) {
			this.buildData()
		}
	}

	onAudioComplete = () => {
		const { dispatch } = this.props

		this.onComplete()
		dispatch(push())
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

	buildNavLinks() {
		const { params: { id, subscription_id, day }, auth } = this.props

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
		// calc which tio we're on if we are going to render tio
		this.tio = mapTioIndices(this.daySegments)
			&& mapTioIndices(this.daySegments).indexOf(this.contentNum)
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
						<PlanDevo devoContent={this.segment.content} hasDevotionalAudio={plan.has_devotional_audio} />
					)
					break

				case 'reference':
					readerContent = (
						<BibleWidget
							customHeaderClass='plan-reader-heading'
							usfm={this.segment.content}
							showChapterPicker={false}
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
							tioIndex={this.tio}
						/>
					)
					break

				default:
			}
		}

		return (
			<div className={`${this.segment && this.segment.kind === 'talk-it-over' ? 'talk-it-over-container' : ''}`}>
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

PlanReaderView.propTypes = {
	params: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
	plan: PropTypes.object.isRequired,
	subscription: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	serverLanguageTag: PropTypes.string.isRequired,
}

function mapStateToProps(state, props) {
	const { params: { id, subscription_id } } = props
	const plan_id = id.split('-')[0]
	return {
		plan: getPlansModel(state) && plan_id in getPlansModel(state).byId
			? getPlansModel(state).byId[plan_id]
			: null,
		subscription: getSubscriptionModel(state)
			&& subscription_id in getSubscriptionModel(state).byId
			? getSubscriptionModel(state).byId[subscription_id]
			: null,
		auth: state.auth,
		hosts: state.hosts,
	}
}

export default connect(mapStateToProps, null)(PlanReaderView)
