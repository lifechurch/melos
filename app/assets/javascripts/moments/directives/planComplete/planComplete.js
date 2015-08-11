/**
 * @ngdoc module
 * @name yv.moments.planComplete
 * @module yv.moments
 * @description
 *
 * Directive for displaying PlanComplete moments
 */
angular.module('yv.moments.planComplete', [])

.directive('momentPlanComplete', function() {
	return {
		replace: true,
		restrict: 'AC',
		templateUrl: '/moment-plan-complete.tpl.html'
	};
})

;