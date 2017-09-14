(function() {
    
    angular
      .module('raincubeApp')
      .controller('devicesCtrl', devicesCtrl);
  
    devicesCtrl.$inject = ['$scope', '$location', 'profile', 'authentication', '$uibModal', '$log', '$document', '$ngConfirm'];
    function devicesCtrl($scope, $location, profile, authentication, $uibModal, $log, $document, $ngConfirm) {
      var vm = this;
      
      vm.devices = [];

      vm.deleteDevice = function (deviceId) {
        $ngConfirm({
            title: "Delete Device",
            content: 'Are you sure you want to delete this device from your account?',
            scope: $scope,
            buttons: {
                yes: {
                    text: 'Yes',
                    btnClass: 'btn-red',
                    action: function (scope, button) {
                      profile.removeDevice(deviceId)
                        .success(function(result) {
                          var devices = vm.devices.filter(function (obj) {
                            return obj.id !== deviceId;
                          });
                          vm.devices = devices;
                        })
                        .error(function (err) {
                          console.log(err);
                        });
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

      vm.addDevice = function (size, parentSelector) {
        var modalIntance = $uibModal.open({
          animation: true,
          component: 'deviceModalComponent'
        });
  
        modalIntance.result.then(function (deviceInfo) {
          profile.addDevice(deviceInfo)
            .success(function(result) {
              vm.devices.push(deviceInfo);
            })
            .error(function (err) {
              console.log(err);
            });
        }, function () {
          $log.info('Modal dismissed');
        });
      };

      vm.editDevice = function (deviceId, size, parentSelector) {
        var modalIntance = $uibModal.open({
          animation: true,
          component: 'deviceModalComponent',
          resolve: {
            device: function () {
              return vm.devices.filter(function (device) {
                return device.id === deviceId;
              });
            }
          }
        });
  
        modalIntance.result.then(function (deviceInfo) {
          profile.editDevice(deviceInfo);
        }, function () {
          $log.info('Modal dismissed');
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

    angular
    .module('raincubeApp')
    .component('deviceModalComponent', {
      templateUrl: 'addDeviceModal.html',
      bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
      },
      controller: function () {
        var vm = this;

        vm.$onInit = function () {
          if (vm.resolve.device) {
            vm.device = vm.resolve.device[0];
            vm.disableIdField = true;
          }
        };
    
        vm.ok = function () {
          vm.close({$value: vm.device});
        };
    
        vm.cancel = function () {
          vm.dismiss({$value: 'cancel'});
        };
      }
    });
})();