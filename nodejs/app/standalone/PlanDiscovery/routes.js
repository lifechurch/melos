import React from 'react'
import { Route, IndexRoute } from 'react-router'
import PlanDiscoveryView from '../../containers/PlanDiscoveryView'
import PlanCollectionView from '../../containers/PlanCollectionView'
import PlansView from '../../containers/PlansView'
import PlansList from '../../containers/PlanList'
import AboutPlanView from '../../containers/AboutPlanView'

import Plan from '../../containers/Plan'
import UnsubbedPlan from '../../containers/UnsubbedPlan'
import PlanDay from '../../containers/PlanDay'
import PlanSettings from '../../containers/PlanSettings'
import PlanCalendar from '../../containers/PlanCalendar'

import PlanReader from '../../containers/PlanReaderView'

import DayCompleteView from '../../containers/DayCompleteView'
import SharedDayCompleteView from '../../containers/SharedDayCompleteView'
import PlanCompleteView from '../../containers/PlanCompleteView'

import LookinsideView from '../../containers/LookinsideView'
import LookinsideSample from '../../containers/LookinsideSample'

import CreatePWFView from '../../containers/CreatePWFView'
import InvitePWFView from '../../containers/InvitePWFView'
import ParticipantsView from '../../containers/ParticipantsView'
import InvitationView from '../../containers/InvitationView'
import TalkItOverRedirect from '../../containers/TalkItOverRedirect'
import MarkCompleteRedirect from '../../containers/MarkCompleteRedirect'

/**
 * get the routes for reading plans
 *
 * @param      {function}  requirePlanDiscoveryData    The require plan discovery data
 * @param      {function}  requirePlanCollectionData   The require plan collection data
 * @param      {function}  requirePlanData             The require plan data
 * @param      {function}  requireSavedPlanData        The require saved plan data
 * @param      {function}  requireRecommendedPlanData  The require recommended plan data
 * @param      {function}  requireSubscribedPlans      The require subscribed plans
 * @param      {function}  requireSavedPlans           The require saved plans
 * @param      {function}  requireCompletedPlans       The require completed plans
 * @param      {function}  requireSubscribedPlan       The require subscribed plan
 * @param			 {function}  requireSamplePlan					 The require sample plan
 * @return     {Node}  { description_of_the_return_value }
 */
export default function (
		requirePlanDiscoveryData,
		requirePlanCollectionData,
		requirePlanData,
		requireSavedPlanData,
		requireRecommendedPlanData,
		requireSubscribedPlans,
		requireSavedPlans,
		requireCompletedPlans,
		requirePlanCompleteData,
		requirePlanView,
		requireSamplePlan,
	) {
	return (
		<Route path="/">
			<Route path="(:lang/)reading-plans" component={PlansView}>
				<IndexRoute component={PlanDiscoveryView} onEnter={requirePlanDiscoveryData} />
				<Route path=":id(-:slug)">
					<IndexRoute component={AboutPlanView} onEnter={requirePlanData} />
					<Route path="day/:day" component={UnsubbedPlan} onEnter={requireSamplePlan} >
						<IndexRoute component={PlanDay} />
					</Route>
				</Route>
			</Route>
			<Route path="(:lang/)reading-plans-collection" component={PlansView}>
				<Route path=":id(-:slug)" component={PlanCollectionView} onEnter={requirePlanCollectionData} />
			</Route>
			<Route path="(:lang/)saved-plans-collection" component={PlansView}>
				<IndexRoute component={PlanCollectionView} onEnter={requireSavedPlanData} />
			</Route>
			<Route path="(:lang/)recommended-plans-collection" component={PlansView}>
				<Route path=":id(-:slug)" component={PlanCollectionView} onEnter={requireRecommendedPlanData} />
			</Route>
			<Route path="(:lang/)users/:username" component={PlansView} isMyPlans>
				<Route path="saved-reading-plans" component={PlansList} view='saved' onEnter={requireSavedPlans} />
				<Route path="completed-reading-plans" component={PlansList} view='completed' />
				<Route path="reading-plans" component={PlansList} view='subscribed' />
			</Route>
			<Route
				path="(:lang/)users/:username/reading-plans/:id(-:slug)/subscription/:subscription_id"
				component={Plan}
			>
				<IndexRoute component={PlanDay} />
				<Route path="day/:day" component={PlanDay} />
				<Route path="edit" component={PlanSettings} />
				<Route path="calendar" component={PlanCalendar} />
			</Route>
			<Route
				path="(:lang/)users/:username/reading-plans/:id(-:slug)/subscription/:subscription_id/day/:day/segment/:content"
				component={PlanReader}
			/>
			<Route
				path="(:lang/)subscription/:subscription_id/day/:day/talk-it-over/:content"
				component={TalkItOverRedirect}
			/>
			<Route
				path="(:lang/)reading-plans/:id(-:slug)/together/:together_id/invitation"
				component={InvitationView}
			/>
			<Route
				path="(:lang/)reading-plans/:id(-:slug)/together/:together_id/participants"
				component={ParticipantsView}
			/>
			<Route
				path="(:lang/)users/:username/reading-plans/:id(-:slug)/together/create"
				component={CreatePWFView}
			/>
			<Route
				path="(:lang/)users/:username/reading-plans/:id(-:slug)/together/:together_id/invite"
				component={InvitePWFView}
			/>
			<Route
				path="(:lang/)users/:username/reading-plans/:id(-:slug)/subscription/:subscription_id/day/:day/mark-complete"
				component={MarkCompleteRedirect}
			/>
			<Route path="(:lang/)users/:username/reading-plans/:id(-:slug)/subscription/:subscription_id/day/:day/completed" component={DayCompleteView} />
			{/* this is also day complete, but an unauthed page with the user id in the url as params, only loaded from the server */}
			<Route path="(:lang/)reading-plans/:id(-:slug)/day/:day/completed" component={SharedDayCompleteView} />
			<Route path="(:lang/)users/:username/reading-plans/:id(-:slug)/completed" component={PlanCompleteView} onEnter={requirePlanCompleteData} />

			{/* ABS LOOKINSIDE */}
			<Route path="lookinside/:id(-:slug)" >
				<IndexRoute component={LookinsideView} onEnter={requirePlanView} />
				<Route path="read/day/:day" component={LookinsideSample} onEnter={requireSamplePlan}>
					<IndexRoute component={PlanDay} />
				</Route>
			</Route>
			<Route component={() => { return <div>Not Found</div> }} />
		</Route>
	)
}
