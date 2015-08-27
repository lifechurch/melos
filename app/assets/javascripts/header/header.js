angular.module('yv.header', [])

.controller('HeaderCtrl', ['$mdMenu', function($mdMenu) {
	//this.isOpen = false;
	//console.log("Header! Woot!");
  this.openMenu = function($mdOpenMenu, ev, isOpen) {
  	ev.preventDefault();
    originatorEv = ev;
		//console.log("MMM", isOpen, $mdOpenMenu, $mdMenu, $mdMenu.hide, $mdMenu.show);

		//if (!this.isOpen) {
			$mdOpenMenu(ev);
			//this.isOpen = true;
		//} else {
			//this.isOpen = false;
		//}
  };	
}])

;