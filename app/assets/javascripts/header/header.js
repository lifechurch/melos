angular.module('yv.header', [])

.controller('HeaderCtrl', [function() {
	console.log("Header! Woot!");
  this.openMenu = function($mdOpenMenu, ev) {
  	ev.preventDefault();
    originatorEv = ev;
    $mdOpenMenu(ev);
  };	
}])

;