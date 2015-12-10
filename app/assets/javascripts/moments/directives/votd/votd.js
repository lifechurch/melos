/**
 * @ngdoc module
 * @name yv.moments.votd
 * @module yv.moments
 * @description
 *
 * Directive for displaying Votd moments
 */
angular.module('yv.moments.votd', [])

.directive('momentVotd', function() {
	return {
		replace: true,
		restrict: 'AC',
		templateUrl: '/moment-votd.tpl.html',
		controller: [ "$scope", "Bible", "$timeout", function($scope, Bible, $timeout) {
			var usfm = $scope.data.object.references[0];
			var version = $scope.data.object.recent_versions[0];

			$scope.data.object.avatar = "/assets/icon-vod.svg";

			$timeout(function() {
				Bible.getVerse(usfm, version.id).success(function(verse) {
					$scope.verseContent = verse.reader_html;
                    $scope.verseHumanRef = verse.human;
					$scope.data.object.title += "<br/><b>" + verse.reader_book + " " + verse.reader_version + "</b>";

				}).error(function(err) {

				});
			}, 100);
		}]		
	};
})

;