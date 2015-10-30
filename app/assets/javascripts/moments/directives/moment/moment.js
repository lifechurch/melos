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
			single: '=',
			socialEnabled: '='
		},
		templateUrl: '/moment.tpl.html',
		controller: function($scope, Like, Comment, $mdMenu, /* Authentication,*/ $element, $timeout) {
			$scope.newComment = {};			
			$scope.like = function() {
				if (!$scope.data.object.likes.is_liked) {
					$scope.data.object.likes.is_liked = true;
					$scope.data.object.likes.count++;
					Like.create($scope.data.object.id, $scope.token).success(function(data) {

					}).error(function(err) {
						$scope.data.object.likes.is_liked = false;
						$scope.data.object.likes.count--;					
					});
				} else {
					$scope.data.object.likes.is_liked = false;
					$scope.data.object.likes.count--;
					Like.delete($scope.data.object.id, $scope.token).success(function(data) {

					}).error(function(err) {
						$scope.data.object.likes.is_liked = true;
						$scope.data.object.likes.count++;					
					});
				}
			};

			$scope.comment = function(event, comment) {
				if (event.keyCode == 13) {
					event.preventDefault();
					$scope.newComment = {};					
					Comment.create($scope.data.object.id, comment, $scope.token).success(function(data) {
						for( var i = 0; i < data.user.avatars.collection.length; i++) {
							var avatar = data.user.avatars.collection[i];
							if (avatar.height == 48) {
								data.user.avatar = avatar.url;
								break;
							}
						}
						data.time_ago = "Just now";
						$scope.data.object.comments.all.push(data);

					}).error(function(err) {
						//TO-DO: Handle Error
					});
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

            $scope.openMenu = function($mdOpenMenu, ev) {
                ev.preventDefault();
                originatorEv = ev;
                $mdOpenMenu(ev);
            };
		}
	};
})
;