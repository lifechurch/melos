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
import PlanDayDevo from '../../containers/PlanDayDevo'
import PlanDayRef from '../../containers/PlanDayRef'

export default function(
		requirePlanDiscoveryData,
		requirePlanCollectionData,
		requirePlanData,
		requireSavedPlanData,
		requireRecommendedPlanData,
		requireSubscribedPlans,
		requireSavedPlans,
		requireCompletedPlans,
		requirePlanDevo,
		requirePlanRefs,
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
			<Route path="(:lang/)users/:username/reading-plans/:id(-:slug)" component={Plan}>
				<IndexRoute component={PlanDay} />
				<Route path="edit" component={PlanSettings} />
				<Route path="calendar" component={PlanCalendar} />
			</Route>
			<Route path="(:lang/)users/:username/reading-plans/:id(-:slug)" component={PlanReader}>
				<Route path="devo" component={PlanDayDevo} onEnter={requirePlanDevo} />
				<Route path="ref" component={PlanDayRef} onEnter={requirePlanRefs} />
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