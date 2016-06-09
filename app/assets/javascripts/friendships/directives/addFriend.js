///friendships/offer?user_id=7947
angular.module('yv.friendships.addFriend', [])

    .directive('addFriend', function() {
        return {
            replace: true,
            restrict: 'A',
            template: '<div>{{friendshipStatus}}<a ng-show="!working && notFriends" ng-click="offerFriendship()">Add Friend</a><span ng-show="outgoing">Request Sent</span><span ng-show="incoming && !working"><a ng-click="acceptFriendship()">Accept</a> / Ignore</span><span ng-show="working">Working...</span><span ng-show="offerError">An error occurred.</span></div>',
            scope: {
              userId: '=',
              friendshipStatus: '@'
            },
            controller: ['$scope', 'Friendships', function($scope, Friendships) {
                $scope.friends  = $scope.friendshipStatus == 'friends';
                $scope.incoming = $scope.friendshipStatus == 'incoming';
                $scope.outgoing = $scope.friendshipStatus == 'outgoing';
                $scope.notFriends = $scope.friendshipStatus == 'not-friends';

                var path = "/friendships/offer?user_id=" + $scope.userId;

                $scope.offerFriendship = function() {
                    $scope.working = true;
                    $scope.offerError = false;
                    Friendships.offer(path, null).success(function(data) {
                        $scope.outgoing = true;
                        $scope.notFriends = false;
                        $scope.working = false;
                    }).error(function(err) {
                        $scope.offerError = true;
                        $scope.working = false;
                    });
                };

                $scope.acceptFriendship = function() {
                    $scope.working = true;
                    $scope.offerError = false;
                    Friendships.accept(path, null).success(function(data) {
                        $scope.friends = true;
                        $scope.working = false;
                    }).error(function(err) {
                        $scope.offerError = true;
                        $scope.working = false;
                    });
                };
            }]
        };
    })

;