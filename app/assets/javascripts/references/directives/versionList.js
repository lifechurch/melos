angular.module("reader.versionList", [])

.directive("readerVersionList", function() {
	return {
		restrict: 'A',
		scope: {
			versions: '='
		},
		controller: ["$scope", function($scope) {
			console.log("VV", $scope);
		}],
		templateUrl: '/reader-version-selector.tpl.html'
		//template: angular.element(document.getElementById("reader-versions-panel")).html(),		
	};
})

;