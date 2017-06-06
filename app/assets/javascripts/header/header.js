angular.module('yv.header', [ 'header.notifications', 'header.friendships'])

.controller('HeaderCtrl', ['$mdMenu', '$scope', function($mdMenu, $scope) {
  var menuIsOpen = [];

  $scope.isMoreOpen = false;

  function isOpen(key) {
      return menuIsOpen.hasOwnProperty(key) && menuIsOpen[key];
  }

  this.openMenu = function($mdOpenMenu, ev, menuKey) {
    ev.preventDefault();

    if (isOpen(menuKey)) {
        menuIsOpen[menuKey] = false;
        $mdMenu.hide();
    } else {
        menuIsOpen[menuKey] = true;
        $mdOpenMenu(ev);
    }
  };

  $scope.signOut = function(url) {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        window.location.href = url;
    }, function() {
        window.location.href = url;
    });
  }

}])

;