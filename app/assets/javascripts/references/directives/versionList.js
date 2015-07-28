angular.module("reader.versionList", [])

.directive("readerVersionList", function() {
	return {
		restrict: 'A',
		scope: {
			selectedVersion: '='
		},
		controller: ["$scope", function($scope) {	
		}],
		template: angular.element(document.getElementById("reader-versions-panel")).html(),		
	};
})

;