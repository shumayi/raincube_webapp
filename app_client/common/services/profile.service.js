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

    var removeDevice = function (deviceId) {
      return $http.get('/removeDevice/' + deviceId, {
        headers: {
          Authorization: 'JWT '+ authentication.getToken()
        }
      });
    }

    var addDevice = function (device) {
      return $http.post('/addDevice', device, {
        headers: {
          Authorization: 'JWT '+ authentication.getToken()
        }
      });
    }

    var editDevice = function (device) {
      return $http.post('/editDevice', device, {
        headers: {
          Authorization: 'JWT '+ authentication.getToken()
        }
      });
    }

    return {
      getProfile : getProfile,
      updateProfile: updateProfile,
      removeDevice: removeDevice,
      addDevice: addDevice,
      editDevice: editDevice
    };
  }
})();