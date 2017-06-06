angular.module('yv.plans.saveForLater', [])

    .directive('saveForLater', function() {
        return {
            replace: true,
            restrict: 'A',
            template: '<a ng-click="toggle()"><img ng-show="saved" class="saved-icon" ng-src="{{checkIconPath}}">{{label()}}</a>',
            scope: {
              saveLabel: "@",
              removeLabel: "@",
              basePath: "@",
              planId: "=",
              saved: "=",
              checkIconPath: "@"
            },
            controller: ["$scope", "Subscription", function($scope, Subscription) {
                $scope.label = function() {
                    if ($scope.saved) {
                        return $scope.removeLabel;
                    } else {
                        return $scope.saveLabel;
                    }
                };

                $scope.toggle = function() {
                    if ($scope.saved) {
                        remove();
                    } else {
                        save();
                    }
                };

                function save() {
                    Subscription.saveForLater($scope.basePath, $scope.planId).success(function(data) {
                        $scope.saved = true;
                    }).error(function(err) {

                    });
                }

                function remove() {
                    Subscription.removeSaved($scope.basePath, $scope.planId).success(function (data) {
                        $scope.saved = false;
                    }).error(function (err) {

                    });
                }
            }]
        };
    })

;