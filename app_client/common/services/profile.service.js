(function() {

  angular
    .module('raincubeApp')
    .service('profile', profile);

  profile.$inject = ['$http', 'authentication'];
  function profile ($http, authentication) {

    var getProfile = function () {
      return $http.get('/userProfile', {
        headers: {
          Authorization: 'JWT ' + authentication.getToken()
        }
      });
    };

    var updateProfile = function (userInfo) {
      return $http.post('/updateProfile', userInfo, {
        headers: {
          Authorization: 'JWT ' + authentication.getToken()
        }
      });
    };

    return {
      getProfile : getProfile,
      updateProfile: updateProfile
    };
  }
})();