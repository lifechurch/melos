import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import calcTodayVsStartDt from '@youversion/utils/lib/readingPlans/calcTodayVsStartDt'
import getReferencesTitle from '@youversion/utils/lib/bible/getReferencesTitle'
import getBibleVersionFromStorage from '@youversion/utils/lib/bible/getBibleVersionFromStorage'
import selectImageFromList from '@youversion/utils/lib/images/selectImageFromList'
import PLAN_DEFAULT from '@youversion/utils/lib/images/readingPlanDefault'
// utils
import Routes from '@youversion/utils/lib/routes/routes'
// components
import LazyImage from '@youversion/melos/dist/components/images/LazyImage'
import PlanMenu from './PlanMenu'
import ShareWidget from './ShareWidget'
import PlanContentListItem from './PlanContentListItem'


function Plan({
	plan,
	day,
	start_dt,
	dayProgress,
	daySegments,
	progressDays,
	progressString,
	bookList,
	savedPlans,
	dispatch,
	children,
	params,
	auth,
	localizedLink,
	isCompleted,
	isRtl,
	serverLanguageTag,
	together_id,
	subscription_id,
	handleContentCheck,
	handleCatchUp,
}) {

	const language_tag = serverLanguageTag || params.lang || auth.userData.language_tag || 'en'
	const isSaved = plan && plan.id && !!((savedPlans && Array.isArray(savedPlans.all) && savedPlans.all.indexOf(plan.id) !== -1))
	const isInFuture = start_dt && calcTodayVsStartDt(start_dt).isInFuture

	let aboutLink,
		myPlansLink,
		bibleLink,
		planLinkNode,
		subscriptionLink,
		startLink,
		planTitle,
		planImgSrc,
		plan_id,
		totalDays,
		refsDiv

	if (plan && plan.id) {
			// build some links
		aboutLink = localizedLink(`/reading-plans/${plan.id}-${plan.slug}`)
		myPlansLink = localizedLink(`/users/${auth.userData.username}/reading-plans`)
		bibleLink = localizedLink(`/bible/${getBibleVersionFromStorage()}`)
		planLinkNode = <Link to={`${aboutLink}/day/1`}><FormattedMessage id='plans.sample' /></Link>
		subscriptionLink = Routes.subscription({
			username: auth.userData.username,
			plan_id: plan.id,
			slug: plan.slug,
			subscription_id,
		})
		startLink = Routes.subscriptionContent({
			username: auth.userData.username,
			plan_id: plan.id,
			slug: plan.slug,
			subscription_id,
			day,
			content: 0,
		})

			// get other plan info
		planTitle = plan.name[language_tag] || plan.name.default
		planImgSrc = plan.images ?
			selectImageFromList({
				images: plan.images,
				width: 640,
				height: 320
			}).url :
			null
		plan_id = plan.id
		totalDays = plan.total_days

		refsDiv = daySegments && daySegments.length > 0
			&& (
				<ul className='no-bullets plan-pieces'>
					{
						daySegments &&
						daySegments.map((segment, i) => {
							let title
							let key = segment.kind
							const link = Routes.subscriptionContent({
								username: auth.userData.username,
								plan_id: plan.id,
								slug: plan.slug,
								subscription_id,
								day,
								content: i,
							})
							const complete = dayProgress &&
								(dayProgress.complete ||
								(dayProgress.partial && dayProgress.partial[i]))

							if (segment.kind === 'devotional') {
								title = <FormattedMessage id='plans.devotional' />
							} else if (segment.kind === 'reference') {
								const usfm = [segment.content]
								title = getReferencesTitle({ bookList, usfmList: usfm }).title
								key = usfm
							} else if (segment.kind === 'talk-it-over') {
								title = <FormattedMessage id='talk it over' />
							}

							return (
								<PlanContentListItem
									key={key}
									title={title}
									isComplete={complete}
									handleIconClick={handleContentCheck
										&& handleContentCheck.bind(this, {
											contentIndex: i,
											complete: !complete
										})
									}
									link={link}
								/>
							)
						})
					}
				</ul>
			)
	}

	return (
		<div className='subscription-show'>
			<div className='plan-overview'>
				<div className='row'>
					<div className='header medium-8 small-11 centered vertical-center'>
						<Link to={`/users/${auth.userData.username}/reading-plans`}>
							<FormattedHTMLMessage id='plans.plans back' />
						</Link>
						<div className='margin-left-auto vertical-center'>
							<div style={{ marginRight: '10px' }}>
								<ShareWidget title={planTitle} url={aboutLink} />
							</div>
							<PlanMenu
								aboutLink={aboutLink}
								subscriptionLink={subscriptionLink}
								// no catchup for together
								onCatchUp={!isInFuture && !together_id && handleCatchUp}
								participantsLink={
									together_id
										&& Routes.togetherParticipants({
											plan_id,
											together_id
										})
								}
							/>
						</div>
					</div>
				</div>
				<div className='row collapse'>
					<div className='horizontal-center' style={{ height: '170', marginBottom: '30px' }}>
						<LazyImage
							alt='plan-image'
							src={planImgSrc}
							width={300}
							height={170}
							placeholder={<img alt='plan' src={PLAN_DEFAULT} />}
						/>
					</div>
				</div>
				<div className='row'>
					<div className='medium-centered text-center columns'>
						<h3 className='plan-title'>{ planTitle }</h3>
					</div>
				</div>
				{
					children
						&& (children.length > 0 || !Array.isArray(children))
						&& React.cloneElement(children, {
							id: plan_id,
							plan,
							start_dt,
							dispatch,
							auth,
							refListNode: refsDiv,
							day,
							daySegments,
							progressDays,
							progressString,
							actionsNode: <div />,
							planLinkNode,
							isSubscribed: !!subscription_id,
							isCompleted,
							totalDays,
							subscriptionLink,
							aboutLink,
							startLink,
							bibleLink,
							myPlansLink,
							language_tag: serverLanguageTag,
							isRtl,
							isSaved,
							together_id,
							handleCompleteRef: handleContentCheck,
							handleCatchUp,
						})
					}
			</div>
		</div>
	)
}

Plan.propTypes = {
	dispatch: PropTypes.func.isRequired,
	plan: PropTypes.object,
	params: PropTypes.object,
	children: PropTypes.object,
	auth: PropTypes.object,
	localizedLink: PropTypes.func,
	serverLanguageTag: PropTypes.string,
	savedPlans: PropTypes.object.isRequired,
	day: PropTypes.string.isRequired,
	together_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	subscription_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	handleContentCheck: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	handleCatchUp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	start_dt: PropTypes.string,
	isCompleted: PropTypes.bool,
	dayProgress: PropTypes.object,
	daySegments: PropTypes.object,
	progressDays: PropTypes.object,
	progressString: PropTypes.object,
	bookList: PropTypes.array.isRequired,
	isRtl: PropTypes.func.isRequired,
}

Plan.defaultProps = {
	plan: {},
	params: {},
	children: {},
	auth: {},
	location: {},
	localizedLink: (param) => { return param },
	serverLanguageTag: '',
	isCompleted: false,
	together_id: null,
	subscription_id: null,
	handleContentCheck: null,
	handleCatchUp: null,
	start_dt: null,
	dayProgress: null,
	daySegments: null,
	progressDays: null,
	progressString: null,
}

export default Plan
