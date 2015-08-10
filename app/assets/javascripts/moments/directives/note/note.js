/**
 * @ngdoc module
 * @name yv.moments.note
 * @module yv.moments
 * @description
 *
 * Directive for displaying Friendship moments
 */
angular.module('yv.moments.note', [])


/**
 * @ngdoc directive
 * @name note
 * @restrict A
 */
.directive('note', function() {
	return {
		restrict: 'A',
		templateUrl: '../src/moments/directives/note/note.tpl.html'
	};
})

.directive('noteMobile', function() {
	return {
		replace: true,
		restrict: 'A',
		templateUrl: '../src/moments/directives/note/note.mobile.tpl.html'
	};
})

;