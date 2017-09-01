(function() {

  angular
    .module('raincubeApp')
    .service('meanData', meanData);

  meanData.$inject = ['$http', 'authentication'];
  function meanData ($http, authentication) {

    var getProfile = function () {
      return $http.get('/userProfile', {
        headers: {
          Authorization: 'JWT ' + authentication.getToken()
        }
      });
    };

    return {
      getProfile : getProfile
    };
  }
})();