import React from 'react'
import { Route, IndexRoute } from 'react-router'
import PlanDiscoveryView from '../../containers/PlanDiscoveryView'
import PlanCollectionView from '../../containers/PlanCollectionView'
import PlansView from '../../containers/PlansView'
import AboutPlanView from '../../containers/AboutPlanView'

export default function(requirePlanDiscoveryData, requirePlanCollectionData, requirePlanData, requireSavedPlanData, requireRecommendedPlanData) {
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
			<Route path="(:lang/)users/:username">
				<Route path="saved-reading-plans" component={MySavedPlansView} />
				<Route path="completed-reading-plans" component={MyCompletedPlansView} />
				<Route path="reading-plans">
					<IndexRoute component={MyPlansView} />
					<Route path=":id(-:slug)">
						<IndexRoute component={MyPlanDayView} />
						<Route path="devo" component={MyPlanDayDevoView} />
						<Route path="ref" component={MyPlanDayRefView} />
						<Route path="edit" component={MyPlanSettingsView} />
						<Route path="calendar" component={MyPlanCalendarView} />
					</Route>
				</Route>
			</Route>
		</Route>
	)
}

/*
MyPlansView
MySavedPlansView
MyCompletedPlansView

MyPlanDayView
MyPlanDayDevoView
MyPlanDayRefView
MyPlanSettingsView
MyPlanCalendarView
*/