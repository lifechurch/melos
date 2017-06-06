/**
 * @ngdoc module
 * @name yv.moments.image
 * @module yv.moments
 * @description
 *
 * Directive for displaying Image moments
 */
angular.module('yv.moments.image', [])

.directive('momentImage', function() {
	return {
		restrict: 'AC',
		templateUrl: '/moment-image.tpl.html'
	};
})

;