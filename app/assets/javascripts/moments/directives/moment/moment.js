/**
 * @ngdoc module
 * @name yv.moments.moment
 * @module yv.moments
 * @description
 *
 * Base directive for displaying elements common to all moments
 */
angular.module('yv.moments.moment', [ /*'yv.api.like', 'yv.api.comment' */])


/**
 * @ngdoc directive
 * @name moment
 * @restrict E
 * @scope
 */
.directive('moment', function() {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			data: '=',
			single: '='
		},
		templateUrl: '/moment.tpl.html',
		controller: function($scope, Like, /* Comment, Authentication,*/ $element, $timeout) {
			var myId;
			
			$scope.showComments = false;

			if (!$scope.data) {
				$scope.data = { liking: {} };
			}

			$timeout(function() { 
				$scope.$watch("data", function(newValue, oldValue) {
					//var myId = Authentication.currentUser().id;
				
					if ($scope.data && $scope.data.liking && $scope.data.liking.all_users) { 
						$scope.data.iLike = $scope.data.liking.all_users.indexOf(myId) >= 0;
					}
				});
			}, 100);

			
			$scope.like = function() {
				Like.create($scope.data.object.id, $scope.token).success(function(data) {
					// if (!moment.iLike) {
					// 	if (!moment.liking) {
					// 		moment.liking = { total: 0 };
					// 	}
					// 	if (!moment.liking.total) {
					// 		moment.liking.total = 0;
					// 	}
					// 	if (!moment.liking.all_users) {
					// 		moment.liking.all_users = [];
					// 	}
					// 	moment.liking.all_users.push(myId);
					// 	moment.liking.total++;
					// 	moment.iLike = true;
					// }
				}).error(function(err) {

				});
			};

			$scope.comment = function(moment, comment) {
				console.log("Comment has been called");
				Comment.Create.save({moment_id: moment.id, content: comment}).$promise.then(
					function(data) {
						console.log("Success!");

					},
					function(err) {
						console.log("Failure!", err);
					}
				);
			};			

			$scope.momentIcon = function() {
				if ($scope.data) { 
					switch ($scope.data.kind_id) {
						case 'plan_subscription.v1':
						case 'plan_completion.v1':
						case 'plan_segment_completion.v1':
							return 'moment-icon-plan';
						case 'highlight.v1':
							return 'moment-icon-highlight';
						case 'bookmark.v1':
							return 'moment-icon-bookmark';
						case 'friendship.v2':
							return 'moment-icon-friend';
						case 'image.v2':
							return 'moment-icon-image';
						case 'note.v1':
							return 'moment-icon-note';
						default:
							return 'moment-icon';
					}
				}
			};

			$scope.momentDirective = function() {
				if ($scope.data) { 
					switch ($scope.data.kind_id) {
						case 'plan_subscription.v1':
							return 'plan-start-mobile';
						case 'plan_completion.v1':
							return 'plan-complete-mobile';
						case 'plan_segment_completion.v1':
							return 'plan-segment-complete-mobile';
						case 'highlight.v1':
							return 'highlight-mobile';
						case 'bookmark.v1':
							return 'bookmark-mobile';
						case 'friendship.v2':
							return 'friendship-mobile';
						case 'image.v2':
							return 'image-mobile';						
						default:
							return 'default-mobile';
					}
				}
			};
		}
	};
})
;