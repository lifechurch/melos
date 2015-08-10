/**
 * @ngdoc module
 * @name yv.moments.planSegmentComplete
 * @module yv.moments
 * @description
 *
 * Directive for displaying PlanSegmentComplete moments
 */
angular.module('yv.moments.planSegmentComplete', [])


/**
 * @ngdoc directive
 * @name planSegmentComplete
 * @restrict A
 */
.directive('planSegmentComplete', function() {
	return {
		restrict: 'AC',
		templateUrl: '../src/moments/directives/planSegmentComplete/planSegmentComplete.tpl.html'
	};
})

.directive('planSegmentCompleteMobile', function() {
	return {
		replace: true,
		restrict: 'AC',
		templateUrl: '../src/moments/directives/planSegmentComplete/planSegmentComplete.mobile.tpl.html'
	};
})

;