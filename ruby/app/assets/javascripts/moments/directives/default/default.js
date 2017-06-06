/**
 * @ngdoc module
 * @name yv.moments.default
 * @module yv.moments
 * @description
 *
 * Directive for displaying Friendship moments
 */
angular.module('yv.moments.default', [])


/**
 * @ngdoc directive
 * @name default
 * @restrict A
 */
.directive('default', function() {
	return {
		restrict: 'AC',
		templateUrl: '../src/moments/directives/default/default.tpl.html'
	};
})

.directive('defaultMobile', function() {
	return {
		replace: true,
		restrict: 'AC',
		templateUrl: '../src/moments/directives/default/default.mobile.tpl.html'
	};
})

;