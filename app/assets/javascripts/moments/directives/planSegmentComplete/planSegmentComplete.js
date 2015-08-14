/**
 * @ngdoc module
 * @name yv.moments.planSegmentComplete
 * @module yv.moments
 * @description
 *
 * Directive for displaying PlanSegmentComplete moments
 */
angular.module('yv.moments.planSegmentComplete', [])

.directive('momentPlanSegmentComplete', function() {
	return {
		replace: true,
		restrict: 'AC',
		templateUrl: '/moment-plan-segment-complete.tpl.html'
	};
})

;