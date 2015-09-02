angular.module('yv.header', [])

.controller('HeaderCtrl', ['$mdMenu', function($mdMenu) {
  this.openMenu = function($mdOpenMenu, ev) {
  	ev.preventDefault();
    originatorEv = ev;
		$mdOpenMenu(ev);
  };	
}])

;