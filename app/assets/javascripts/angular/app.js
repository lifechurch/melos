angular.module('yv', ['$preloaded', 'ngSanitize', 'ngResource'])

.factory('Bible', [ '$resource', function($resource) {
    return {
        Chapter:	$resource('http://yv-node.herokuapp.com/api/bible/chapter'),
        Versions:	$resource('http://yv-node.herokuapp.com/api/bible/versions'),
        Version:	$resource('http://yv-node.herokuapp.com/api/bible/version')
    };
}])

.controller("ReaderCtrl", [ '$scope', '$chapter', '$version', '$content', 'Bible', '$next', '$previous', '$current', '$compile', function($scope, $chapter, $version, $content, Bible, $next, $previous, $current, $compile) {

    $scope.chapter = $chapter;
    $scope.chapter.reference = { usfm: [ $chapter.book + "." + $chapter.chapter ], human: $current };

    $scope.version = $version;
    $scope.version.abbreviation = $version.attributes.local_abbreviation.toUpperCase() || $version.attributes.abbreviation.toUpperCase();
    $scope.version.id = $version.attributes.id;

    $scope.content = $content;
    $scope.chapter.next = $next;
    $scope.chapter.previous = $previous;

        $scope.compile = function(html) {
            console.log("comp now");
            return $compile(html)($scope);
        };

    //$("#chapter_selector").html($compile($("#chapter_selector").html())($scope));

        $scope.loadVersion = function(id, reloadChapter) {
            console.log("LOADING VERSION", id, reloadChapter);

            Bible.Version.get({id:id}).$promise.then(function(version) {
                //console.log(version);
                version.abbreviation = version.abbreviation.toUpperCase();
                $scope.version = version;
                if (reloadChapter && $scope.chapter && $scope.version && ($scope.chapter.reference.version_id !== $scope.version.id)) {
                    $scope.loadChapter($scope.chapter.reference.usfm, $scope.version.id);
                } else {
                    $scope.closeMenu();
                }
            });

//            if ($scope.chaptersModal) {
//                if ($ionicModal) {
//                    $scope.chaptersModal.hide();
//                } else {
//                    $scope.chaptersModal.dismiss("Version Selected");
//                }
//            }
        };

        $scope.loadChapter = function(reference, versionId) {
          console.log("LOADING CHAPTER", reference, versionId);
//        $scope.loadingChapter = true;
//
//        var hideLoader;
//
//        if ($ionicLoading) {
//            $ionicLoading.show({
//                content: 'Loading',
//                animation: 'fade-in',
//                showBackdrop: false,
//                maxWidth: 200,
//                showDelay: 0
//            });
//        }

//        if ($scope.version && ($scope.version.id != versionId)) {
//            console.log("calling version", $scope.version.id, versionId);
//            $scope.loadVersion(versionId, false);
//        }

        Bible.Chapter.get({id:versionId, reference:reference}).$promise.then(function(chapter) {
            console.log(chapter);
            $scope.chapter = chapter;
            $scope.content = chapter.content;
            $scope.closeMenu('#menu_version');
            $scope.closeMenu('#menu_book_chapter');

            //$scope.loadingChapter = false;
            //if (hideLoader) {
            //hideLoader.hide();
            //}

//            if ($ionicLoading && $ionicNavBarDelegate) {
//                //$ionicNavBarDelegate.title($scope.chapter.reference.human);
//                $ionicLoading.hide();
//            }
        });

        $scope.closeMenu = function(menuId) {
            console.log("Closing Menu");
            $(menuId).fadeOut('fast').removeClass('open');
            $(document).scrollTop(0);
            $('.version_close_btn').toggleClass('selected').scrollTop(0);
            $(menuId + "_trigger").parent().removeClass("li_active");
        };

    };

}])

;