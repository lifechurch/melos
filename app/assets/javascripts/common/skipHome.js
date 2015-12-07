angular.module('common.skipHome', ['ngCookies'])

    .directive('skipHome', function() {
        return {
            restrict: 'A',
            scope: {
              nowSkippedText: '@',
              futureSkipText: '@',
              checked: '='
            },
            controller: function($element, $window, $scope, $cookies) {
                var link = angular.element($element.children()[0]);
                $scope.checked = $cookies.getObject("setting-skip-home");

                function update() {
                    if(!$scope.checked){
                        $cookies.remove("setting-skip-home");
                        link.html($scope.futureSkipText);
                    } else {
                        var expires = new Date();
                        expires.setFullYear(expires.getFullYear() + 1);
                        $cookies.putObject("setting-skip-home", true, { expires: expires });
                        link.html($scope.nowSkippedText);
                    }
                }

                link.on("click", function() {
                    $scope.checked = !$cookies.getObject("setting-skip-home");
                    update();
                });

                update();
            }
        };
    })
;