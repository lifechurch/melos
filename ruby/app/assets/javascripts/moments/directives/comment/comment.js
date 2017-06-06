/**
 * @ngdoc module
 * @name yv.moments.planStart
 * @module yv.moments
 * @description
 *
 * Directive for displaying PlanStart moments
 */
angular.module('yv.moments.comment', [])


/**
 * @ngdoc directive
 * @name comment
 * @restrict A
 */
.directive('comment', function() {
	return {
		restrict: 'AC',
		scope: {
			data: '='
		},		
		templateUrl: '../src/moments/directives/comment/comment.tpl.html'
	};
})

.directive('commentMobile', function() {
	return {
		replace: true,
		restrict: 'EC',
		scope: {
			data: '='
		},		
		templateUrl: '../src/moments/directives/comment/comment.mobile.tpl.html'
	};
})

;