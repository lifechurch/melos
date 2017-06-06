/**
 * @ngdoc module
 * @name yv.moments.planStart
 * @module yv.moments
 * @description
 *
 * Directive for displaying PlanStart moments
 */
angular.module('yv.moments.planStart', [])

.directive('momentPlanStart', function() {
	return {
		replace: true,
		restrict: 'AC',
		templateUrl: '/moment-plan-start.tpl.html'
	};
})

;