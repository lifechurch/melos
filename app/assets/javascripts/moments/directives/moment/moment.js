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
			socialEnabled: '=',
            deleted: '='
		},
		templateUrl: '/moment.tpl.html',
		controller: ["$scope", "Like", "Comment", "$state", "$mdMenu", "$element", "$timeout", "$stateParams", "$state", "$window", "Moments", function($scope, Like, Comment, $state, $mdMenu, $element, $timeout, $stateParams, $state, $window, Moments) {
			$scope.newComment = {};

            if (typeof $scope.data === 'object' && ['plan_subscription','plan_completion'].indexOf($scope.data.kind) !== -1) {
                $scope.data.object.moment_title += (', <b>' + $scope.data.object.plan_title + '</b>');
            }

            $scope.getVerseUrl = function(usfm, version) {
                var locale = $stateParams.locale;
                if (locale) {
                    return $state.href("reader-locale", {version:version, usfm:usfm, locale:locale});
                } else {
                    return $state.href("reader", {version:version, usfm:usfm});
                }
            };

            $scope.needsMoreMenu = function() {
                if (
                    (typeof $scope.data === 'object') &&

                    ((
                        $scope.data.object.references &&
                        $scope.data.object.references.length
                    ) ||
                    (
                        $scope.data.object.actions &&
                        (
                            $scope.data.object.actions.about_plan ||
                            $scope.data.object.actions.start_plan
                        )
                    )
                   )){
                    return true;
                } else {
                    return false;
                }
            };

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
                        data.owned_by_me = true;
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

            $scope.goSingle = function() {
                if (!$scope.single && $scope.data.object.id) {
                    $state.go("moment", { momentId: $scope.data.object.id});
                }
            };

            $scope.delete = function(moment) {
                $scope.deleted = true;
                if ($scope.data.object.actions.deletable) {
                    Moments.delete($scope.data.object.path).success(function() {

                    }).error(function() {
                        $scope.deleted = false;
                    });
                }
            };

            $scope.deleteComment = function(comment) {
               $scope.data.object.comments.all.splice($scope.data.object.comments.all.indexOf(comment), 1);
               Comment.delete(comment.id).success(function() {

               }).error(function() {

               });
            };
		}]
	};
})
;