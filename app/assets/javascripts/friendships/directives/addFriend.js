///friendships/offer?user_id=7947
angular.module('yv.friendships.addFriend', [])

    .directive('addFriend', function() {
        return {
            replace: true,
            restrict: 'AC',
            template: '<div></div><a ng-show="!working" ng-click="offerFriendship()">Add Friend</a><span ng-show="working">Working...</span><span ng-show="offerError">An error occurred.</span></div>',
            scope: {
              user_id: '='
            },
            controller: ['$scope', 'Friendships', function($scope, Friendships) {

                $scope.offerFriendship = function() {
                    $scope.working = true;
                    $scope.offeredFriendship = false;
                    $scope.offerError = false;
                    var path = "/friendships/offer?user_id=" + $scope.user_id;
                    Friendships.offer(path, null).success(function(data) {
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