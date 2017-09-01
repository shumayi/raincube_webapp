(function () {

  angular
    .module('raincubeApp')
    .service('awsIot', awsIot);

  awsIot.$inject = ['$http'];
  function awsIot ($http) {

    openChannel = function(channelNumber) {
        return $http.get('/openChannel/' + channelNumber, {
          headers: {
            Authorization: 'JWT '+ authentication.getToken()
          }
        });
    };

    closeChannel = function(channelNumber) {
        return $http.get('/closeChannel/' + channelNumber, {
          headers: {
            Authorization: 'JWT '+ authentication.getToken()
          }
        });
    };

    return {
      openChannel: openChannel,
      closeChannel: closeChannel
    };
  }
})();