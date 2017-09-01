(function () {

  angular
    .module('raincubeApp')
    .service('weather', weather);

  weather.$inject = ['$http', 'authentication'];
  function weather ($http, authentication) {

    getForecast = function(zipCode) {
      return $http.get('/forecast/' + zipCode, {
        headers: {
          Authorization: 'JWT '+ authentication.getToken()
        }
      });
    };

    return {
      getForecast: getForecast
    };
  }
})();