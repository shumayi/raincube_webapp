(function () {

  angular
  .module('raincubeApp')
  .controller('facebookLoginCtrl', facebookLoginCtrl);

  facebookLoginCtrl.$inject = ['$location', '$routeParams', 'authentication'];
  function facebookLoginCtrl($location, $routeParams, authentication) {
    var vm = this;

    authentication.saveToken($routeParams.token);

    $location.path('dashboard');
  }

})();