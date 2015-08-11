/**
 * @ngdoc module
 * @name yv.moments.friendship
 * @module yv.moments
 * @description
 *
 * Directive for displaying Friendship moments
 */
angular.module('yv.moments.friendship', [])

.directive('momentFriendship', function() {
	return {
		replace: true,
		restrict: 'AC',
		templateUrl: '/moment-friendship.tpl.html'
	};
})

;