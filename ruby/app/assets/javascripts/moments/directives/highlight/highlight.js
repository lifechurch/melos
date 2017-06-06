/**
 * @ngdoc module
 * @name yv.moments.highlight
 * @module yv.moments
 * @description
 *
 * Directive for displaying Highlight moments
 */
angular.module('yv.moments.highlight', [])

.directive('momentHighlight', function() {
	return {
		replace: true,
		restrict: 'AC',
		templateUrl: '/moment-highlight.tpl.html',
		controller: [ "$scope", "Bible", "$timeout", function($scope, Bible, $timeout) {
			$timeout(function() {
				$scope.usfm = Bible.fixVerseRange($scope.data.object.references[0].usfm);
				var version = $scope.data.object.references[0].version_id;
				Bible.getVerse($scope.usfm, version).success(function(verse) {
					$scope.verseContent = verse.reader_html;
                    $scope.verseHumanRef = verse.human;
				}).error(function(err) {

				});
			}, 100);
		}]
	};
})

;