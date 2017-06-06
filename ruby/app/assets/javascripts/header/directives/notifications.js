angular.module('header.notifications', [ 'api.notifications' ])

.directive('headerNotifications', function() {
    return {
        restrict: 'A',
        templateUrl: '/header-notifications.tpl.html',
        replace: false,
        controller: ['Notifications', '$scope', function(Notifications, $scope) {
            Notifications.get(5).success(function(notifications) {
                $scope.notifications = notifications;
            });
        }]
    };
})

;