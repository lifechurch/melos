/**
 * @ngdoc module
 * @name yv.moments.planComplete
 * @module yv.moments
 * @description
 *
 * Directive for displaying PlanComplete moments
 */
angular.module('yv.moments.planComplete', [])


/**
 * @ngdoc directive
 * @name planComplete
 * @restrict A
 */
.directive('planComplete', function() {
	return {
		restrict: 'AC',
		templateUrl: '../src/moments/directives/planComplete/planComplete.tpl.html'
	};
})

.directive('planCompleteMobile', function() {
	return {
		replace: true,
		restrict: 'AC',
		templateUrl: '../src/moments/directives/planComplete/planComplete.mobile.tpl.html'
	};
})

;