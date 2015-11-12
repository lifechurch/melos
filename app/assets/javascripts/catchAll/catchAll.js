angular.module('yv.catchAll', [])

    .config([ '$stateProvider', function($stateProvider) {
        $stateProvider

            .state('press', {
                url: 		'/press',
                controller: 'CatchAllCtrl'
            })
            .state('press-locale', {
                url: 		'/{locale:[a-zA-Z]{2}(?:\-{1}[a-zA-Z]{2})*}/press',
                controller: 'CatchAllCtrl'
            })


            .state('versions', {
                url: 		'/versions',
                controller: 'CatchAllCtrl'
            })
            .state('versions-locale', {
                url: 		'/{locale:[a-zA-Z]{2}(?:\-{1}[a-zA-Z]{2})*}/versions',
                controller: 'CatchAllCtrl'
            })

            .state('privacy', {
                url: 		'/privacy',
                controller: 'CatchAllCtrl'
            })
            .state('privacy-locale', {
                url: 		'/{locale:[a-zA-Z]{2}(?:\-{1}[a-zA-Z]{2})*}/privacy',
                controller: 'CatchAllCtrl'
            })

            .state('terms', {
                url: 		'/terms',
                controller: 'CatchAllCtrl'
            })
            .state('terms-locale', {
                url: 		'/{locale:[a-zA-Z]{2}(?:\-{1}[a-zA-Z]{2})*}/terms',
                controller: 'CatchAllCtrl'
            })


            .state('donate', {
                url: 		'/donate',
                controller: 'CatchAllCtrl'
            })
            .state('donate-locale', {
                url: 		'/{locale:[a-zA-Z]{2}(?:\-{1}[a-zA-Z]{2})*}/donate',
                controller: 'CatchAllCtrl'
            })


            .state('about', {
                url: 		'/about',
                controller: 'CatchAllCtrl'
            })
            .state('about-locale', {
                url: 		'/{locale:[a-zA-Z]{2}(?:\-{1}[a-zA-Z]{2})*}/about',
                controller: 'CatchAllCtrl'
            })

            .state('app', {
                url: 		'/app',
                controller: 'CatchAllCtrl'
            })
            .state('app-locale', {
                url: 		'/{locale:[a-zA-Z]{2}(?:\-{1}[a-zA-Z]{2})*}/app',
                controller: 'CatchAllCtrl'
            })

            .state('kids', {
                url: 		'/kids',
                controller: 'CatchAllCtrl'
            })
            .state('kids-locale', {
                url: 		'/{locale:[a-zA-Z]{2}(?:\-{1}[a-zA-Z]{2})*}/kids',
                controller: 'CatchAllCtrl'
            })

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