/**
 * @ngdoc module
 * @name yv.moments.note
 * @module yv.moments
 * @description
 *
 * Directive for displaying Friendship moments
 */
angular.module('yv.moments.note', [])

.directive('momentNote', function() {
	return {
		replace: true,
		restrict: 'A',
		templateUrl: '/moment-note.tpl.html'
	};
})

;