angular.module('yv.search', [])

    .config([ '$stateProvider', function($stateProvider) {
        $stateProvider

            .state('search-users', {
                url: 		 '/search/users',
                controller:  'SearchCtrl'
            })
            .state('search-users-locale', {
                url: 		 '/{locale:[a-zA-Z]{2}(?:\-{1}[a-zA-Z]{2})*}/search/users',
                controller:  'SearchCtrl'
            })

        ;
    }])

    .controller("SearchCtrl", [function() {

    }])
;