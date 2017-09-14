(function() {
  
  angular
    .module('raincubeApp')
    .controller('profileCtrl', profileCtrl);

  profileCtrl.$inject = ['$location', 'profile', 'authentication', '$uibModal', '$log', '$document'];
  function profileCtrl($location, profile, authentication, $uibModal, $log, $document) {
    var vm = this;

    vm.user = {};

    profile.getProfile()
    .success(function(data) {
      vm.user = data;
      vm.user.fullName = vm.user.firstName + ' ' + vm.user.lastName;
    })
    .error(function (err) {
      console.log(err);
    });

    vm.openModal = function (size, parentSelector) {
      var modalIntance = $uibModal.open({
        animation: true,
        component: 'userModalComponent',
        resolve: {
          user: function () {
            return vm.user;
          }
        }
      });

      modalIntance.result.then(function (userInfo) {
        var user = userInfo;
        profile.updateProfile(userInfo)
          .success(function(data) {
          })
          .error(function (err) {
            console.log(err);
          });
      }, function () {
        $log.info('Modal dismissed');
      });
    }
  }

  angular
  .module('raincubeApp')
  .component('userModalComponent', {
    templateUrl: 'userModalContent.html',
    bindings: {
      resolve: '<',
      close: '&',
      dismiss: '&'
    },
    controller: function () {
      var vm = this;
  
      vm.$onInit = function () {
        vm.user = vm.resolve.user;
      };
  
      vm.ok = function () {
        vm.close({$value: vm.user});
      };
  
      vm.cancel = function () {
        vm.dismiss({$value: 'cancel'});
      };
    }
  });

})();