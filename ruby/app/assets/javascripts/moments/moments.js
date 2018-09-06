angular.module('yv.moments', [
  'api.moments',
  'api.likes',
  'api.comments',
  'api.votd',
  'yv.moments.moment',
  'yv.moments.bookmark',
  'yv.moments.highlight',
  'yv.moments.friendship',
  'yv.moments.image',
  'yv.moments.note',
  'yv.moments.votd',
  'yv.moments.planStart',
  'yv.moments.planComplete',
  'yv.moments.planSegmentComplete',
  'yv.moments.planCarousel',
  'yv.moments.moreMenu',
  'yv.moments.subscribeMenu'
])

.config([ '$stateProvider', function($stateProvider) {
  $stateProvider

  .state('moments', {
    url: '/moments',
    controller: 'MomentsCtrl',
    templateUrl: '/moment-feed.tpl.html'
  })

  .state('moments-locale', {
    url: '/{locale:[a-zA-Z]{2}(?:\-{1}[a-zA-Z]{2})*}/moments',
    controller: 'MomentsCtrl',
    templateUrl: '/moment-feed.tpl.html'
  })

  .state('moment', {
    url: '/moments/:momentId',
    controller: 'MomentCtrl',
    templateUrl: '/single-moment-feed.tpl.html'
  })

  .state('moment-locale', {
    url: '/{locale:[a-zA-Z]{2}(?:\-{1}[a-zA-Z]{2})*}/moments/:momentId',
    controller: 'MomentCtrl',
    templateUrl: '/single-moment-feed.tpl.html'
  })

  .state('moments-highlights', {
    url: '/highlights/:momentId',
    controller: 'MomentCtrl',
    templateUrl: '/single-moment-feed.tpl.html'
  })

  .state('moments-highlights-locale', {
    url: '/{locale:[a-zA-Z]{2}(?:\-{1}[a-zA-Z]{2})*}/highlights/:momentId',
    controller: 'MomentCtrl',
    templateUrl: '/single-moment-feed.tpl.html'
  })

  .state('comment', {
    url: '/moments/:momentId/comments/:commentId',
    controller: 'MomentCtrl',
    templateUrl: '/single-moment-feed.tpl.html'
  })

  .state('comment-locale', {
    url: '/{locale:[a-zA-Z]{2}(?:\-{1}[a-zA-Z]{2})*}/moments/:momentId/comments/:commentId',
    controller: 'MomentCtrl',
    templateUrl: '/single-moment-feed.tpl.html'
  })

  .state('publicNote', {
    url: '/notes/:momentId',
    controller: 'MomentCtrl',
    templateUrl: '/single-moment-feed.tpl.html'
  })

  .state('publicNote-locale', {
    url: '/{locale:[a-zA-Z]{2}(?:\-{1}[a-zA-Z]{2})*}/notes/:momentId',
    controller: 'MomentCtrl',
    templateUrl: '/single-moment-feed.tpl.html'
  })

  .state('profileActivity', {
    url: '/users/:username',
    controller: 'MomentsCtrl',
    template: angular.element(document.getElementById("current-ui-view")).html(),
    data: { inProfile: true, momentType: null }
  })

  .state('profileActivity-locale', {
    url: '/{locale:[a-zA-Z]{2}(?:\-{1}[a-zA-Z]{2})*}/users/:username',
    controller: 'MomentsCtrl',
    template: angular.element(document.getElementById("current-ui-view")).html(),
    data: { inProfile: true, momentType: null }
  })

  .state('profileNotes', {
    url: '/users/:username/notes',
    controller: 'MomentsCtrl',
    template: angular.element(document.getElementById("current-ui-view")).html(),
    data: { inProfile: true, momentType: 'note' }
  })

  .state('profileNotes-locale', {
    url: '/{locale:[a-zA-Z]{2}(?:\-{1}[a-zA-Z]{2})*}/users/:username/notes',
    controller: 'MomentsCtrl',
    template: angular.element(document.getElementById("current-ui-view")).html(),
    data: { inProfile: true, momentType: 'note' }
  })

  .state('profileHighlights', {
    url: '/users/:username/highlights',
    controller: 'MomentsCtrl',
    template: angular.element(document.getElementById("current-ui-view")).html(),
    data: { inProfile: true, momentType: 'highlight' }
  })

  .state('profileHighlights-locale', {
    url: '/{locale:[a-zA-Z]{2}(?:\-{1}[a-zA-Z]{2})*}/users/:username/highlights',
    controller: 'MomentsCtrl',
    template: angular.element(document.getElementById("current-ui-view")).html(),
    data: { inProfile: true, momentType: 'highlight' }
  })

  .state('profileBookmarks', {
    url: '/users/:username/bookmarks',
    controller: 'MomentsCtrl',
    template: angular.element(document.getElementById("current-ui-view")).html(),
    data: { inProfile: true, momentType: 'bookmark' }
  })

  .state('profileBookmarks-locale', {
    url: '/{locale:[a-zA-Z]{2}(?:\-{1}[a-zA-Z]{2})*}/users/:username/bookmarks',
    controller: 'MomentsCtrl',
    template: angular.element(document.getElementById("current-ui-view")).html(),
    data: { inProfile: true, momentType: 'bookmark' }
  })

  .state('profileImages', {
    url: '/users/:username/images',
    controller: 'MomentsCtrl',
    template: angular.element(document.getElementById("current-ui-view")).html(),
    data: { inProfile: true, momentType: 'image' }
  })

  .state('profileImages-locale', {
    url: '/{locale:[a-zA-Z]{2}(?:\-{1}[a-zA-Z]{2})*}/users/:username/images',
    controller: 'MomentsCtrl',
    template: angular.element(document.getElementById("current-ui-view")).html(),
    data: { inProfile: true, momentType: 'image' }
  })

  ;
}])

.controller("MomentCtrl", ["$scope", "Moments", "$state", "$stateParams", function($scope, Moments, $state, $stateParams) {
  Moments.getSingle($stateParams.momentId).success(function(moment) {
    $scope.moment = moment[0];
  }).error(function() {

  });
}])

.controller("MomentsCtrl", ["$scope", "$rootScope", "$window", "Moments", "$state", "$stateParams", function($scope, $rootScope, $window, Moments, $state, $stateParams) {
  $scope.currentPage = 0;
  $scope.pagingFinished = false;

  var momentType = ($state.current.data && $state.current.data.momentType) ? $state.current.data.momentType : null;
  var inProfile = ($state.current.data && $state.current.data.inProfile) ? $state.current.data.inProfile : false;
  var getMoments =inProfile ? Moments.getByTypeAndUser : Moments.get;

  $scope.loadMore = function() {
    $scope.loading = true;
    $scope.currentPage++;
    getMoments($scope.currentPage, $stateParams["username"], momentType).success(function(data) {
      data.forEach(function(moment) {
        try {
          if (moment.kind === 'note') {
            moment.object.content = moment.object.content.replace(/\n/g, "<br />")
          }
        } catch(e) { }
      })

      if (!$scope.moments) {
        $scope.moments = data;
      } else {
        $scope.moments = $scope.moments.concat(data);
      }

      $scope.loading = false;

      if (data.length < 10) {
        $scope.pagingFinished = true;
      }
    }).error(function(err) {
      //TO-DO: Handle Error
      $scope.loading = false;
    });
  };

  $scope.loadMore();
}])

;
