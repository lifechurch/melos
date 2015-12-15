/**
 * @ngdoc module
 * @name yv.moments.friendship
 * @module yv.moments
 * @description
 *
 * Directive for displaying Friendship moments
 */
angular.module('yv.moments.friendship', [])

.directive('momentFriendship', function() {
	return {
		replace: true,
		restrict: 'AC',
		templateUrl: '/moment-friendship.tpl.html',
        controller: ['$scope', 'Friendships', function($scope, Friendships) {
            $scope.offerFriendship = function(path, token) {
                $scope.working = true;
                $scope.offeredFriendship = false;
                $scope.offerError = false;
                Friendships.offer(path, token).success(function(data) {
                  $scope.working = false;
                  $scope.offeredFriendship = true;
                }).error(function(err) {
                  $scope.offerError = true;
                  $scope.working = false;
                });
            };
        }]
	};
})

;