(function() {
    
    angular
      .module('raincubeApp')
      .controller('devicesCtrl', devicesCtrl);
  
    devicesCtrl.$inject = ['$scope', '$location', 'profile', 'authentication', '$uibModal', '$log', '$document', '$ngConfirm'];
    function devicesCtrl($scope, $location, profile, authentication, $uibModal, $log, $document, $ngConfirm) {
      var vm = this;
      
      vm.devices = [];

      vm.delete = function (deviceId) {
        console.log("Hello", deviceId);
        $ngConfirm({
            title: "Delete Device",
            content: 'Are you sure you want to delete this device from your account?',
            scope: $scope,
            buttons: {
                yes: {
                    text: 'Yes',
                    btnClass: 'btn-red',
                    action: function (scope, button) {

                    }
                },
                no: {
                    text: 'No',
                    btnClass: 'btn-blue',
                    action: function (scope, button) {

                    }
                }
            }
        });
      };

      profile.getProfile()
      .success(function(data) {
        var user = data;
        vm.devices = user.devices;
      })
      .error(function (err) {
        console.log(err);
      });
    }
  
})();