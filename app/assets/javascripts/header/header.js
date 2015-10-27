angular.module('yv.header', [ 'header.notifications', 'header.friendships' ])

.controller('HeaderCtrl', ['$mdMenu', function($mdMenu) {
  this.openMenu = function($mdOpenMenu, ev) {
  	ev.preventDefault();
    originatorEv = ev;
		$mdOpenMenu(ev);
  };	
}])

;