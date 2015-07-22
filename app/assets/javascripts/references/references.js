angular.module('yv.references', [ 'ui.router', 'ngSanitize' ])

.config([ '$stateProvider', function($stateProvider) {
	$stateProvider
	.state('reader', {
		url: '/bible/:version/:usfm',
		controller: 'ReaderCtrl',
		templateProvider: function() { return angular.element(document.getElementById("current-ui-view")).html(); }
	})
	;
}])

.controller("ReaderCtrl", ["$scope", "$stateParams", "$location", "$http", "$rootScope", "$state", "$sce", "$rootScope", "$timeout", function($scope, $stateParams, $location, $http, $rootScope, $state, $sce, $rootScope, $timeout) {
	$scope.version = $stateParams.version;
	$scope.usfm = $stateParams.usfm;
	$scope.showReaderAudio = false;
	$scope.showReaderFont = false;
	$scope.readerFontSize = 19;

	function hideAllPanels() {
		$scope.showReaderAudio = false;
		$scope.showReaderFont = false;		
	}

	$scope.togglePanel = function(panel) {
		var originalValue = $scope[panel];
		hideAllPanels();
		$scope[panel] = !originalValue;

		if (panel == "showReaderFont" && $scope[panel]) {
			$timeout(function() {
				$rootScope.$broadcast('reCalcViewDimensions');			
			}, 50);
		}
	};

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
			var player = document.getElementById("reader_audio_player");
			player.src = $sce.trustAsResourceUrl($scope.reader_audio.url);
			player.load();
			//$scope.reader_audio.trustedUrl = $sce.trustAsResourceUrl($scope.reader_audio.url);
		}
	}

	if (TEMPLATE_FROM_RAILS.hasOwnProperty($location.path())) {
		fillScope(TEMPLATE_FROM_RAILS[$location.path()]);
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