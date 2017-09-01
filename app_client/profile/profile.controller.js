(function() {
  
  angular
    .module('raincubeApp')
    .controller('profileCtrl', profileCtrl);

  profileCtrl.$inject = ['$location', 'meanData', 'authentication'];
  function profileCtrl($location, meanData, authentication) {
    var vm = this;

    vm.user = {};
    vm.currentUser = authentication.currentUser();

    meanData.getProfile()
      .success(function(data) {
        console.log(data);
        vm.user = data;
        vm.user.fullName = vm.user.firstName + ' ' + vm.user.lastName;
      })
      .error(function (e) {
        console.log(e);
      });
  }

})();