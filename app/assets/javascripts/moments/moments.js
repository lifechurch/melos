angular.module('yv.moments', [
	'api.moments',
	'api.likes',
	'yv.moments.moment',
	'yv.moments.bookmark',
	'yv.moments.highlight',	
	'yv.moments.votd'
])

.config([ '$stateProvider', function($stateProvider) {
	$stateProvider
	
	.state('moments', {
		url: 		'/moments',
		controller: 	'MomentsCtrl',
		template: 	'<div class="row"><div class="medium-8 columns medium-offset-2"><div ng-repeat="moment in moments"><moment data="moment"></moment></div><button ng-click="loadMore()" class="solid-button green">Load More</button></div></div>'
	})

	.state('moments.locale', {
		url: 		'/:locale/moments',
		controller: 	'MomentsCtrl',
		template: 	'<div class="row"><div class="medium-8 columns medium-offset-2"><div ng-repeat="moment in moments"><moment data="moment"></moment></div></div></div>'
	})

	;
}])

.controller("MomentsCtrl", ["$scope", "Moments", function($scope, Moments) {
	$scope.moments = [];
	$scope.currentPage = 0;

	$scope.loadMore = function() {
		$scope.currentPage++;
		Moments.get($scope.currentPage).success(function(data) {
			console.log(data);
			$scope.moments = $scope.moments.concat(data);
		}).error(function(err) {
			//TO-DO: Handle Error
		});
	};

	$scope.loadMore();
}])

;