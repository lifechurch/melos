angular.module('yv.moments', [
	'api.moments',
	'api.likes',
	'api.comments',
	'yv.moments.moment',
	'yv.moments.bookmark',
	'yv.moments.highlight',	
	'yv.moments.friendship',
	'yv.moments.image',
	'yv.moments.note',
	'yv.moments.votd',
	'yv.moments.planStart',
	'yv.moments.planComplete',
	'yv.moments.planSegmentComplete'
])

.config([ '$stateProvider', function($stateProvider) {
	$stateProvider
	
	.state('moments', {
		url: 		'/moments',
		controller: 	'MomentsCtrl',
		template: 	'<div class="row"><div class="medium-8 columns medium-offset-2"><div ng-repeat="moment in moments"><moment data="moment"></moment></div><div layout="row" layout-sm="column" layout-align="space-around" ng-if="loading"><md-progress-circular md-mode="indeterminate"></md-progress-circular></div><button ng-click="loadMore()" class="solid-button green full" ng-if="!loading">Load More</button></div></div>'
	})

	.state('moments.locale', {
		url: 		'/:locale/moments',
		controller: 	'MomentsCtrl',
		template: 	'<div class="row"><div class="medium-8 columns medium-offset-2"><div ng-repeat="moment in moments"><moment data="moment"></moment></div></div></div>'
	})

	;
}])

.controller("MomentsCtrl", ["$scope", "$rootScope", "$window", "Moments", function($scope, $rootScope, $window, Moments) {
	$scope.moments = [];
	$scope.currentPage = 0;

	$scope.loadMore = function() {
		$scope.loading = true;
		$scope.currentPage++;
		Moments.get($scope.currentPage).success(function(data) {
			console.log(data);
			$scope.moments = $scope.moments.concat(data);
			$scope.loading = false;
		}).error(function(err) {
			//TO-DO: Handle Error
			$scope.loading = false;			
		});
	};

	$scope.loadMore();

	console.log("Listen up!");
	var stopListener = $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
		console.log("Yo");
		if (toState.name !== fromState.name) {
			console.log("in");
			// If we're going somewhere else, disconnect this listener
			stopListener();
			$window.location.href = $state.href(toState, toParams);
		}
	});	
}])

;