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
            $scope.usfm = Bible.fixVerseRange($scope.data.object.references[0]);
			var version = $scope.data.object.recent_versions[0];

			$scope.data.object.avatar = "/assets/votd.svg";

			$timeout(function() {
				Bible.getVerse($scope.usfm, version.id).success(function(verse) {
					$scope.verseContent = verse.reader_html;
                    $scope.verseHumanRef = verse.human;
					$scope.data.object.title += "<br/><b>" + $scope.verseHumanRef + "</b>";

				}).error(function(verse) {
                    // if first votd reference wasn't valid for the selected version, then use the alternate votd ref stored as the second element in the refs array
                    $scope.usfm = Bible.fixVerseRange($scope.data.object.references[1]);

                    Bible.getVerse($scope.usfm, version.id).success(function(verse) {
                        $scope.verseContent = verse.reader_html;
                        $scope.verseHumanRef = verse.human;
                        $scope.data.object.title += "<br/><b>" + $scope.verseHumanRef + "</b>";

                    });
                });
			}, 100);
		}]
	};
})

;
