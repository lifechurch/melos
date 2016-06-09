///friendships/offer?user_id=7947
angular.module('yv.friendships.addFriend', [])

    .directive('addFriend', function() {
        return {
            replace: true,
            restrict: 'A',
            template: '<div><a ng-show="!working && notFriends" ng-click="offerFriendship()">{{sAddFriend}}</a><span ng-show="outgoing">{{sRequestSent}}</span><span ng-show="incoming && !working"><a ng-click="acceptFriendship()">{{sAccept}}</a> / <a ng-click="denyFriendship()">{{sIgnore}}</a></span><span ng-show="working">{{sWorking}}</span><span ng-show="friends">{{sFriends}}</span><span ng-show="offerError">{{sError}}</span></div>',
            scope: {
              userId: '=',
              friendshipStatus: '@',
              sAddFriend: '@',
              sRequestSent: '@',
              sAccept: '@',
              sIgnore: '@',
              sWorking: '@',
              sError: '@',
              sFriends: '@'
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
                    Friendships.accept($scope.userId, null).success(function(data) {
                        $scope.friends = true;
                        $scope.incoming = false;
                        $scope.notFriends = false;
                        $scope.working = false;
                    }).error(function(err) {
                        $scope.offerError = true;
                        $scope.working = false;
                    });
                };

                $scope.denyFriendship = function() {
                    $scope.working = true;
                    $scope.offerError = false;
                    Friendships.deny($scope.userId, null).success(function(data) {
                        $scope.friends = false;
                        $scope.incoming = false;
                        $scope.notFriends = true;
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