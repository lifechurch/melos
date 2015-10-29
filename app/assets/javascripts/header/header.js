angular.module('yv.header', [ 'header.notifications', 'header.friendships' ])

.controller('HeaderCtrl', ['$mdMenu', function($mdMenu) {
  var menuIsOpen = [];

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
}])

;