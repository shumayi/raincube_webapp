(function () {

  angular.module('raincubeApp', ['ngRoute', 'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'chart.js']);

  function config ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'home/home.view.html',
        controller: 'homeCtrl',
        controllerAs: 'vm'
      })
      .when('/register', {
        templateUrl: '/auth/register/register.view.html',
        controller: 'registerCtrl',
        controllerAs: 'vm'
      })
      .when('/login', {
        templateUrl: '/auth/login/login.view.html',
        controller: 'loginCtrl',
        controllerAs: 'vm'
      })
      .when('/profile', {
        templateUrl: '/profile/profile.view.html',
        controller: 'profileCtrl',
        controllerAs: 'vm'
      })
      .when('/auth/facebook', {
        redirectTo: function () {
          return "/auth/facebook";
        }
      })
      .when('/fb/:token', {
        templateUrl: '/dashboard/dashboard.view.html',
        controller: 'facebookLoginCtrl',
        controllerAs: 'vm'
      })
      .when('/dashboard', {
        templateUrl: '/dashboard/dashboard.view.html',
        controller: 'dashboardCtrl',
        controllerAs: 'vm'
      })
      .otherwise({redirectTo: '/'});

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
  }

  function run($rootScope, $location, authentication) {
    $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
      if ($location.path() === '/profile' && !authentication.isLoggedIn()) {
        $location.path('/');
      }

      if ($location.path() === '/dashboard' && !authentication.isLoggedIn()) {
        $location.path('/');
      }
    });
  }
  
  angular
    .module('raincubeApp')
    .config(['$routeProvider', '$locationProvider', config])
    .run(['$rootScope', '$location', 'authentication', run]);

})();