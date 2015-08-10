/**
 * @ngdoc module
 * @name yv.moments.planComplete
 * @module yv.moments
 * @description
 *
 * Directive for displaying PlanComplete moments
 */
angular.module('yv.moments.image', [])


/**
 * @ngdoc directive
 * @name image
 * @restrict A
 */
.directive('image', function() {
	return {
		restrict: 'AC',
		templateUrl: '../src/moments/directives/image/image.tpl.html'
	};
})

.directive('imageMobile', function() {
	return {
		replace: true,
		restrict: 'AC',
		templateUrl: '../src/moments/directives/image/image.mobile.tpl.html'
	};
})

;