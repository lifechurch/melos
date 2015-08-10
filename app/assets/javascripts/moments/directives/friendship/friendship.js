/**
 * @ngdoc module
 * @name yv.moments.friendship
 * @module yv.moments
 * @description
 *
 * Directive for displaying Friendship moments
 */
angular.module('yv.moments.friendship', [])


/**
 * @ngdoc directive
 * @name friendship
 * @restrict A
 */
.directive('friendship', function() {
	return {
		restrict: 'AC',
		templateUrl: '../src/moments/directives/friendship/friendship.tpl.html'
	};
})

.directive('friendshipMobile', function() {
	return {
		replace: true,
		restrict: 'AC',
		templateUrl: '../src/moments/directives/friendship/friendship.mobile.tpl.html'
	};
})

;