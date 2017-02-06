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
import PlanDay from '../../containers/PlanDay'
import PlanSettings from '../../containers/PlanSettings'
import PlanCalendar from '../../containers/PlanCalendar'

import PlanReader from '../../containers/PlanReaderView'
import PlanDevo from '../../features/PlanDiscovery/components/planReader/PlanDevo'
import PlanRef from '../../features/PlanDiscovery/components/planReader/PlanRef'

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
 * @return     {Node}  { description_of_the_return_value }
 */
export default function(
		requirePlanDiscoveryData,
		requirePlanCollectionData,
		requirePlanData,
		requireSavedPlanData,
		requireRecommendedPlanData,
		requireSubscribedPlans,
		requireSavedPlans,
		requireCompletedPlans,
		requireSubscribedPlan,
		requirePlanReferences
	) {
	return (
		<Route path="/">
			<Route path="(:lang/)reading-plans" component={PlansView}>
				<IndexRoute component={PlanDiscoveryView} onEnter={requirePlanDiscoveryData} />
				<Route path=":id(-:slug)" component={AboutPlanView} onEnter={requirePlanData} />
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
			<Route path="(:lang/)users/:username/reading-plans/:id(-:slug)" component={Plan} onEnter={requireSubscribedPlan}>
				<IndexRoute component={PlanDay} onChange={requirePlanReferences} />
				<Route path="edit" component={PlanSettings} />
				<Route path="calendar" component={PlanCalendar} />
			</Route>
			<Route path="(:lang/)users/:username/reading-plans/:id(-:slug)" component={PlanReader}>
				<Route path="devo" component={PlanDevo} />
				<Route path="ref" component={PlanRef} />
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