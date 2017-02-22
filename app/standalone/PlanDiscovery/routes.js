import React from 'react'
import { Route, IndexRoute } from 'react-router'
import PlanDiscoveryView from '../../containers/PlanDiscoveryView'
import PlanCollectionView from '../../containers/PlanCollectionView'
import PlansView from '../../containers/PlansView'
import AboutPlanView from '../../containers/AboutPlanView'

import MySubscribedPlans from '../../containers/MySubscribedPlans'
import MySavedPlans from '../../containers/MySavedPlans'
import MyCompletedPlans from '../../containers/MyCompletedPlans'

import Plan from '../../containers/Plan'
import UnsubbedPlan from '../../containers/UnsubbedPlan'
import PlanDay from '../../containers/PlanDay'
import PlanSettings from '../../containers/PlanSettings'
import PlanCalendar from '../../containers/PlanCalendar'

import PlanReader from '../../containers/PlanReaderView'
import PlanDevo from '../../features/PlanDiscovery/components/planReader/PlanDevo'
import PlanRef from '../../features/PlanDiscovery/components/planReader/PlanRef'

import DayCompleteView from '../../containers/DayCompleteView'
import SharedDayCompleteView from '../../containers/SharedDayCompleteView'
import PlanCompleteView from '../../containers/PlanCompleteView'

import LookinsideView from '../../containers/LookinsideView'
import LookinsideSample from '../../containers/LookinsideSample'

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
		requireSubscribedPlan,
		requirePlanReferences,
		requirePlanCompleteData,
		requirePlanView,
		requireSamplePlan
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
			<Route path="(:lang/)users/:username" component={PlansView}>
				<Route path="saved-reading-plans" component={MySavedPlans} onEnter={requireSavedPlans} />
				<Route path="completed-reading-plans" component={MyCompletedPlans} onEnter={requireCompletedPlans} />
				<Route path="reading-plans" component={MySubscribedPlans} onEnter={requireSubscribedPlans} />
			</Route>
			<Route path="(:lang/)users/:username/reading-plans/:id(-:slug)" component={Plan} onChange={requireSubscribedPlan} onEnter={requireSubscribedPlan}>
				<IndexRoute component={PlanDay} />
				<Route path="day/:day" component={PlanDay} />
				<Route path="edit" component={PlanSettings} />
				<Route path="calendar" component={PlanCalendar} />
			</Route>
			<Route path="(:lang/)users/:username/reading-plans/:id(-:slug)/day/:day" component={PlanReader}>
				<Route path="devo" component={PlanDevo} />
				<Route path="ref/:content" component={PlanRef} />
			</Route>
			<Route path="(:lang/)users/:username/reading-plans/:id(:slug)/day/:day/completed" component={DayCompleteView} onEnter={requirePlanView} />
			{/* this is also day complete, but an unauthed page with the user id in the url as params */}
			<Route path="(:lang/)reading-plans/:id(:slug)/day/:day/completed" component={SharedDayCompleteView} />
			<Route path="(:lang/)users/:username/reading-plans/:id(:slug)/completed" component={PlanCompleteView} onEnter={requirePlanCompleteData} />

			{/* ABS LOOKINSIDE */}
			<Route path="lookinside/:id(:slug)">
				<IndexRoute component={LookinsideView} onEnter={requirePlanView} />
				<Route path="read/day/:day" component={LookinsideSample} onEnter={requireSamplePlan} onChange={() => { console.log('laekrbgkjaehrbglae') }}>
					<IndexRoute component={PlanDay} />
				</Route>
			</Route>
		</Route>
	)
}

/*

MyPlans (PlansView)
  - Subscribed (MySubscribedPlans)
 - Saved (MySavedPlans)
 - Completed (MyCompletedPlans)

Plan (Plan)
 - Overview (PlanDay)
 - Settings (PlanSettings)
 - Calendar (PlanCalendar)

PlanReader
 - Devo (PlanDayDevo)
 - Ref (PlanDayRef)

*/
