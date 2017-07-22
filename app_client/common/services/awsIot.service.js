(function () {

  angular
    .module('raincubeApp')
    .service('awsIot', awsIot);

  awsIot.$inject = ['$http'];
  function awsIot ($http) {

    openChannel = function(channelNumber) {
        return $http.get('/openChannel/' + channelNumber);
    };

    closeChannel = function(channelNumber) {
        return $http.get('/closeChannel/' + channelNumber);
    };

    return {
      openChannel: openChannel,
      closeChannel: closeChannel
    };
  }


})();