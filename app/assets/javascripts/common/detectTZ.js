angular.module('common.detectTZ', [])

    .directive('detectTz', function() {
        return {
            restrict: 'A',
            scope: {
                userTz: '@'
            },
            controller: ["$element", "$scope", "$timeout", function($element, $scope, $timeout) {

                $timeout(function() {
                    var tz = jstz.determine();
                    // if no user tz was given or they only have the default then set the determined tz to the element
                    if( !$scope.userTz || ['etc/utc', 'utc'].indexOf($scope.userTz.toLowerCase()) != -1 ) {
                        $element.val(tz.name());
                    } else { // user already has updated tz and we want to set the element to that
                        $element.val($scope.userTz);
                    }
                });

            }]
        };
    })

;