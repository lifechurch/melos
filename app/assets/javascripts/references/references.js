angular.module('yv.references', [ 'ui.router', 'ngSanitize' ])

.controller("ReaderCtrl", ["$scope", "$stateParams", "$location", "$http", "$rootScope", "$state", "$sce", function($scope, $stateParams, $location, $http, $rootScope, $state, $sce) {
	console.log("ReaderCtrl");	
	$scope.version = $stateParams.version;
	$scope.usfm = $stateParams.usfm;

	function loadChapter(location_path) {

		$http.get(location_path, { responseType: 'json', headers: { 'Accept' : 'application/json' } })

		.success(function(data, status, headers, config) {
			fillScope(data);
		})

		.error(function(data, status, headers, config) {
			//TO-DO: Handle Error!
		});
	}

	function fillScope(newScope) {
		angular.extend($scope, newScope);
		if ($scope.reader_audio && $scope.reader_audio.url) {
			$scope.reader_audio.trustedUrl = $sce.trustAsResourceUrl($scope.reader_audio.url);		
		}
	}

	if (template.hasOwnProperty($location.path())) {
		fillScope($scope, template[$location.path()]);
	} else {
		loadChapter($location.path());
	}

	var stopListener = $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
		if (toState.name == fromState.name) {
			event.preventDefault();
			loadChapter($state.href(toState, toParams));
		} else {
			stopListener();
		}
	});	
}])

;