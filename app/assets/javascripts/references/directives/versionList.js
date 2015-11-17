angular.module("reader.versionList", [])

.directive("readerVersionList", function() {
	return {
		restrict: 'A',
		scope: {
			versions: '=',
			filter: '=',
			usfm: '=',
			togglePanel: '=',
            loadParallelChapter: '=',
            setParallelVersion: '='
		},
		controller: ["$scope", "$state", "RecentVersions", function($scope, $state, RecentVersions) {

            $scope.recentVersions = RecentVersions.all();

            $scope.recentVersionCount = function() {
                return RecentVersions.count();
            };

			$scope.loadVersion = function(version, saveToRecent) {
                if (saveToRecent) {
                    RecentVersions.add(version);
                    $scope.recentVersions = RecentVersions.all();
                }

                $scope.togglePanel('showReaderVersions');
                $scope.filter = "";

                if ($scope.setParallelVersion) {
                    $scope.loadParallelChapter($scope.usfm, version.id);
                } else {
                    $state.go($state.current.name, { usfm: $scope.usfm, version: version.id });
                }
			}
		}],
		templateUrl: '/reader-version-selector.tpl.html'
	};
})

;