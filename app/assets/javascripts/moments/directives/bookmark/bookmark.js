/**
 * @ngdoc module
 * @name yv.moments.bookmark
 * @module yv.moments
 * @description
 *
 * Directive for displaying Bookmark moments
 */
angular.module('yv.moments.bookmark', [])

.directive('momentBookmark', function() {
	return {
		replace: true,
		restrict: 'AC',
		templateUrl: '/moment-bookmark.tpl.html',
		controller: [ "$scope", "Bible", "$timeout", function($scope, Bible, $timeout) {
			$timeout(function() {
				var usfm = $scope.data.object.references[0].usfm;
				var version = $scope.data.object.references[0].version_id;
				Bible.getVerse(usfm, version).success(function(verse) {
					$scope.verseContent = verse.reader_html;
				}).error(function(err) {

				});
			}, 100);
		}]		
	};
})

;