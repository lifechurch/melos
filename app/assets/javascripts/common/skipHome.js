angular.module('common.skipHome', ['ngCookies'])

    .directive('skipHome', function() {
        return {
            restrict: 'A',
            scope: {
              nowSkippedText: '@',
              futureSkipText: '@'
            },
            controller: function($element, $window, $scope, $cookies) {
                var check = angular.element($element.children()[0]);
                var label = angular.element($element.children()[1]);

                check.on("change", function() {
                    var checked = check.attr("checked");
                    if(typeof checked === 'undefined'){
                        $cookies.remove("setting-skip-home");
                        label.html($scope.futureSkipText);
                    } else {
                        var expires = new Date();
                        expires.setFullYear(expires.getFullYear() + 1);
                        $cookies.putObject("setting-skip-home", true, { expires: expires })
                        label.html($scope.nowSkippedText);
                    }
                });
            }
        };
    })
;