angular.module('yv.catchAll', [])

    .config([ '$stateProvider', function($stateProvider) {
        $stateProvider
            .state('videos', {
                url: 		'/videos',
                controller: 'CatchAllCtrl'
            })
            .state('videos-locale', {
                url: 		'/{locale:[a-zA-Z]{2}(?:\-{1}[a-zA-Z]{2})*}/videos',
                controller: 'CatchAllCtrl'
            })


            .state('videos.series', {
                url: 		'/:seriesId/series',
                controller: 'CatchAllCtrl'
            })
            .state('videos.series-locale', {
                url: 		'/{locale:[a-zA-Z]{2}(?:\-{1}[a-zA-Z]{2})*}/:seriesId/series',
                controller: 'CatchAllCtrl'
            })


            .state('videos.single', {
                url: 		'/:seriesId',
                controller: 'CatchAllCtrl'
            })
            .state('videos.single-locale', {
                url: 		'/{locale:[a-zA-Z]{2}(?:\-{1}[a-zA-Z]{2})*}/:seriesId',
                controller: 'CatchAllCtrl'
            })


            .state('readingPlan-all', {
                url: 		'/reading-plans',
                controller: 'CatchAllCtrl'
            })
            .state('readingPlan-all-locale', {
                url: 		'/{locale:[a-zA-Z]{2}(?:\-{1}[a-zA-Z]{2})*}/reading-plans',
                controller: 'CatchAllCtrl'
            })


            .state('readingPlan-single', {
                url: 		'/reading-plans/:planId',
                controller: 'CatchAllCtrl'
            })
            .state('readingPlan-single-locale', {
                url: 		'/{locale:[a-zA-Z]{2}(?:\-{1}[a-zA-Z]{2})*}/reading-plans/:planId',
                controller: 'CatchAllCtrl'
            })


            .state('readingPlan-mine', {
                url: 		'/users/:user/reading-plans',
                controller: 'CatchAllCtrl'
            })
            .state('readingPlan-mine-locale', {
                url: 		'/{locale:[a-zA-Z]{2}(?:\-{1}[a-zA-Z]{2})*}/users/:user/reading-plans',
                controller: 'CatchAllCtrl'
            })


            .state('home', {
                url: 		'/',
                controller: 'CatchAllCtrl'
            })
            .state('home-locale', {
                url: 		'/{locale:[a-zA-Z]{2}(?:\-{1}[a-zA-Z]{2})*}/',
                controller: 'CatchAllCtrl'
            })
        ;
    }])

    .controller("CatchAllCtrl", ["$window", "$location", "$state", function($window, $location, $state) {

    }])
;