(function () {

  angular
    .module('raincubeApp')
    .service('weather', weather);

  weather.$inject = ['$http'];
  function weather ($http) {

    getForecast = function(zipCode) {
      return $http.get('/forecast/' + zipCode);
    };

    return {
      getForecast: getForecast
    };
  }


})();