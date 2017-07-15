(function () {

  angular
    .module('raincubeApp')
    .service('weather', weather);

  weather.$inject = ['$http', '$window', '$location'];
  function weather ($http, $window, $location) {

    getForecast = function(zipCode) {
      return $http.get('/forecast/' + zipCode);
    };

    return {
      getForecast: getForecast
    };
  }


})();