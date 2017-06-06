angular.module('header.friendships', [ 'api.friendships' ])

    .directive('headerFriendships', function() {
        return {
            restrict: 'A',
            templateUrl: '/header-friendships.tpl.html',
            replace: false,
            controller: ['Friendships', '$scope', function(Friendships, $scope) {
                function getFriendshipRequests() {
                    Friendships.get(5).success(function (friendships) {
                        $scope.friendships = friendships;
                    });
                }

                $scope.denyFriendship = function(id, token) {
                    Friendships.deny(id, token).success(function() {
                        getFriendshipRequests();
                    }).error(function() {

                    });
                };

                $scope.acceptFriendship = function(id, token) {
                  Friendships.accept(id, token).success(function() {
                      getFriendshipRequests();
                  }).error(function() {

                  });
                };

                getFriendshipRequests();
            }]
        };
    })

;