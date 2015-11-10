angular.module('yv.catchAll', [])

    .config([ '$stateProvider', function($stateProvider) {
        $stateProvider
            .state('videos', {
                url: 		'/videos',
                controller: 'CatchAllCtrl'
            })
            .state('videos.series', {
                url: 		'/:seriesId/series',
                controller: 'CatchAllCtrl'
            })
            .state('videos.single', {
                url: 		'/:seriesId',
                controller: 'CatchAllCtrl'
            })

            .state('readingPlan-all', {
                url: 		'/reading-plans',
                controller: 'CatchAllCtrl'
            })
            .state('readingPlan-single', {
                url: 		'/reading-plans/:planId',
                controller: 'CatchAllCtrl'
            })
            .state('readingPlan-mine', {
                url: 		'/users/:user/reading-plans',
                controller: 'CatchAllCtrl'
            })
            .state('home', {
                url: 		'/',
                controller: 'CatchAllCtrl'
            })
        ;
    }])

    .controller("CatchAllCtrl", ["$window", "$location", function($window, $location) {

    }])
;