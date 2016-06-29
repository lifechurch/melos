angular.module('yv.plans', [])

    .config([ '$stateProvider', function($stateProvider) {
        $stateProvider
            .state('user-plan-edit', {
                url: '/users/:user/reading-plans/:planSlug/edit',
                controller: 'PlansCtrl'
            })
            .state('user-plan-edit-locale', {
                url: '/{locale:[a-zA-Z]{2}(?:\-{1}[a-zA-Z]{2})*}/users/:user/reading-plans/:planSlug/edit',
                controller: 'PlansCtrl'
            })


            .state('user-plan-calendar', {
                url: '/users/:user/reading-plans/:planSlug/calendar',
                controller: 'PlansCtrl'
            })
            .state('user-plan-calendar-locale', {
                url: '/{locale:[a-zA-Z]{2}(?:\-{1}[a-zA-Z]{2})*}/users/:user/reading-plans/:planSlug/calendar',
                controller: 'PlansCtrl'
            })
        ;
    }])

    .controller('PlansCtrl', ['$scope', 'Subscription', '$window', function($scope, Subscription, $window) {
        $scope.showSubscribeButtons = false;

        $scope.startPlan = function(basePath, planId, privacy) {
            Subscription.create(basePath, planId, privacy, null).success(function() {
                $window.location.href = basePath + "/" + planId;
            }).error(function() {

            });
        };
    }])

;