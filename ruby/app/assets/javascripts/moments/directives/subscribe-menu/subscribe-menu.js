angular.module('yv.moments.subscribeMenu', [ ])

    .directive('subscribeMenu', function() {
        return {
            replace: true,
            restrict: 'A',
            scope: {
                moment: '='
            },
            templateUrl: '/moment-subscribe-menu.tpl.html',
            controller: [ '$scope', 'Versions', 'Votd', '$state', function($scope, Versions, Votd, $state) {
                $scope.allowedHours = [1, 2, 3, 4, 5, 6, 7, 8, 9 , 10 , 11, 12];
                $scope.allowedMinutes = [ '00', '15', '30', '45' ];
                $scope.allowedMeridians = [ 'AM', 'PM' ];
                $scope.isSubscribed = $scope.moment.object.actions.edit_subscription;

                function convertTimeToObject(t) {
                    var parts = t.split(":");
                    var hour = parseInt(parts[0], 10);
                    var meridian = 'AM';
                    var minute = parts[1];

                    if (hour > 12) {
                        hour = hour - 12;
                        meridian = 'PM';
                    }

                    return {
                        hour: hour,
                        minute: minute,
                        meridian: meridian
                    };
                }

                if ($scope.isSubscribed && $scope.moment.object.subscription) {
                    var subTime = convertTimeToObject($scope.moment.object.subscription.time);
                    $scope.subscription = {
                        version_id: $scope.moment.object.subscription.version_id,
                        hour: subTime.hour,
                        minute: subTime.minute,
                        meridian: subTime.meridian
                    };
                } else {
                    $scope.subscription = {
                        version_id: 1,
                        hour: 9,
                        minute: '00',
                        meridian: 'AM'
                    };
                }

                $scope.loadVersions = function() {
                    Versions.get(null, true).success(function(versions) {
                        $scope.versions = versions.by_language[0].versions;
                    }).error(function(err) {

                    });
                };

                $scope.save = function(subscription, $event) {
                    $event.stopPropagation();
                    subscription.type = 'email';
                    subscription.commit = 'Subscribe';
                    Votd.create(subscription).success(function() {
                        $state.go($state.current, {}, {reload: true});
                    }).error(function() {
                    });
                };

                $scope.unsub = function() {

                };

                $scope.loadVersions();
            }]
        };
    })

;