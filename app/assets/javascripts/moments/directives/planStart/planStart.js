/**
 * @ngdoc module
 * @name yv.moments.planStart
 * @module yv.moments
 * @description
 *
 * Directive for displaying PlanStart moments
 */
angular.module('yv.moments.planStart', [])


/**
 * @ngdoc directive
 * @name planStart
 * @restrict A
 */
.directive('planStart', function() {
	return {
		restrict: 'AC',
		templateUrl: '../src/moments/directives/planStart/planStart.tpl.html'
	};
})

.directive('planStartMobile', function() {
	return {
		replace: true,
		restrict: 'AC',
		templateUrl: '../src/moments/directives/planStart/planStart.mobile.tpl.html'
	};
})

;