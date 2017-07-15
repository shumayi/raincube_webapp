(function () {

  angular
    .module('raincubeApp')
    .controller('navigationCtrl', navigationCtrl);

  navigationCtrl.$inject = ['$location','authentication'];
  function navigationCtrl($location, authentication) {
    var vm = this;

    vm.isLoggedIn = authentication.isLoggedIn();
  
    vm.currentUser = authentication.currentUser();
    
    if (vm.currentUser) {
      vm.currentUser.fullname = vm.currentUser.firstName + ' ' + vm.currentUser.lastName;
    }
 
    vm.logout = function () {
      authentication.logout();
    };
  }

})();