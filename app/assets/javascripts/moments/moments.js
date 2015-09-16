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

	.state('profileActivity', {
		url: 		'/users/:username',
		controller: 	'MomentsCtrl',
		template: angular.element(document.getElementById("current-ui-view")).html(),
		data: { inProfile: true, momentType: null }
	})

	.state('profileNotes', {
		url: 		'/users/:username/notes',
		controller: 	'MomentsCtrl',
		template: angular.element(document.getElementById("current-ui-view")).html(),
		data: { inProfile: true, momentType: 'note' }
	})

	.state('profileHighlights', {
		url: 		'/users/:username/highlights',
		controller: 	'MomentsCtrl',
		template: angular.element(document.getElementById("current-ui-view")).html(),
		data: { inProfile: true, momentType: 'highlight' }
	})

	.state('profileBookmarks', {
		url: 		'/users/:username/bookmarks',
		controller: 	'MomentsCtrl',
		template: angular.element(document.getElementById("current-ui-view")).html(),
		data: { inProfile: true, momentType: 'bookmark' }
	})

	.state('profileImages', {
		url: 		'/users/:username/images',
		controller: 	'MomentsCtrl',
		template: angular.element(document.getElementById("current-ui-view")).html(),
		data: { inProfile: true, momentType: 'image' }
	})	

	;
}])

.controller("MomentsCtrl", ["$scope", "$rootScope", "$window", "Moments", "$state", "$stateParams", function($scope, $rootScope, $window, Moments, $state, $stateParams) {
	$scope.currentPage = 0;
	
	var momentType = ($state.current.data && $state.current.data.momentType) ? $state.current.data.momentType : null;
	var inProfile = ($state.current.data && $state.current.data.inProfile) ? $state.current.data.inProfile : false;
	var getMoments =inProfile ? Moments.getByTypeAndUser : Moments.get;

	$scope.loadMore = function() {
		$scope.loading = true;
		$scope.currentPage++;
		getMoments($scope.currentPage, $stateParams["username"], momentType).success(function(data) {
			if (!$scope.moments) { 
				$scope.moments = data; 
			} else { 			
				$scope.moments = $scope.moments.concat(data);
			}
			$scope.loading = false;
		}).error(function(err) {
			//TO-DO: Handle Error
			$scope.loading = false;			
		});
	};

	$scope.loadMore();

	//console.log("Listen up!", $templateCache.get('/moment.tpl.html'));
	// var stopListener = $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
	// 	console.log("Yo");
	// 	if (toState.name !== fromState.name) {
	// 		console.log("in");
	// 		// If we're going somewhere else, disconnect this listener
	// 		stopListener();
	// 		$window.location.href = $state.href(toState, toParams);
	// 	}
	// });	
}])

;