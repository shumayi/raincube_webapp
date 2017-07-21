(function() {
  
  angular
    .module('raincubeApp')
    .controller('dashboardCtrl', dashboardCtrl);

  dashboardCtrl.$inject = ['$scope', '$interval', '$location', 'weather'];
  function dashboardCtrl($scope, $interval, $location, weather) {
    var vm = this;

    var weatherIcons = {
        "rain": "./images/rc_raining.svg",
        "heavyRain": "./images/rc_heavy_rain.svg",
        "lightning": "./images/rc_lightning.svg",
        "overcast": "./images/rc_overcast.svg",
        "sunny": "./images/rc_sunny.svg",
        "windy": "./images/rc_windy.svg"
    }

    vm.forecasts = [];
    vm.timeLengths = [];
    vm.timeInterval = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

    vm.zones = [
        { zoneNumber: 1, title:'ZONE 1', countdownInSeconds: 0, countdownInMinutes: 0 },
        { zoneNumber: 2, title:'ZONE 2', countdownInSeconds: 0, countdownInMinutes: 0 },
        { zoneNumber: 3, title:'ZONE 3', countdownInSeconds: 0, countdownInMinutes: 0 }
    ];
    
    vm.setTime = function (zone, time) {
        vm.timeLengths[zone] = time;
    }

    var stop = [];
    vm.startCountdown = function (zone) {
        var countdownTime = vm.timeLengths[zone] * 60;

        stop[zone-1] = $interval(function () {
            countdownTime--;

            vm.zones[zone-1].countdownInSeconds = Math.floor(countdownTime % 60);
            vm.zones[zone-1].countdownInMinutes = Math.floor((countdownTime / 60) % 60);

            if (countdownTime <= 0) {
                vm.stopCountdown(stop[zone-1]);
            }
        }, 1000);
    }

    vm.stopCountdown = function (zone) {
        if (angular.isDefined(stop[zone-1])) {
            $interval.cancel(stop[zone-1]);
            stop[zone-1] = undefined;
        }
    }

    weather
        .getForecast('33569')
        .success(function(data) {
            setForecastData(data.daily.data);
        })
        .error(function (err) {
            console.log(err);
        });

    function dayAsString(dayIndex) {
        var weekdays = new Array(7);
        weekdays[0] = "SUN";
        weekdays[1] = "MON";
        weekdays[2] = "TUE";
        weekdays[3] = "WED";
        weekdays[4] = "THU";
        weekdays[5] = "FRI";
        weekdays[6] = "SAT";

        return weekdays[dayIndex];
    }

    function setForecastData(forecastData) {
        forecastData.forEach(function (current, index) {
            var forecast = {
                iconName: getWeatherIcon(current.icon).name,
                icon: getWeatherIcon(current.icon).icon,
                day: dayAsString(new Date(current.time * 1000).getDay()),
                rainProbability: Math.floor(current.precipProbability * 100),
                rainIntensity: (current.precipIntensityMax * 24).toFixed(2),
                rainIntensityHeight: getRainIntensityStyle((current.precipIntensityMax * 24).toFixed(2)).height,
                rainIntensityWidth: getRainIntensityStyle((current.precipIntensityMax * 24).toFixed(2)).width
            };

            vm.forecasts.push(forecast);
        });
    }

    function getWeatherIcon(iconName) {
        switch (iconName) {
            case 'rain':
            case "snow":
            case "sleet":
                return { icon: weatherIcons.rain, name: 'RAINY' };
            case "cloudy":
            case "fog":
            case "partly-cloudy-day":
            case "partly-cloudy-night":
                return { icon: weatherIcons.overcast, name: 'CLOUDY' };
            case "clear-day":
            case "clear-night":
                return { icon: weatherIcons.sunny, name: 'SUNNY' };
            case "wind":
                return { icon: weatherIcons.windy, name: 'WINDY' };
            case "thunderstorm":
                return { icon: weatherIcons.lightning, name: 'STORMY' };
            default:
                return { icon: weatherIcons.sunny, name: 'SUNNY' };
        }
    }

    function getRainIntensityStyle(rainIntensity) {
        switch (true) {
            case (rainIntensity == 0):
                return {height: "1px", width: "1px"};
            case (rainIntensity < 0.25):
                return {height: "5px", width: "5px"};
            case (rainIntensity < 0.5):
                return {height: "10px", width: "10px"};
            case (rainIntensity < 1):
                return {height: "15px", width: "15px"};
            case (rainIntensity >= 1):
                return {height: "20px", width: "20px"};
            default:
                return {height: "5px", width: "5px"};
        }
    }
  }

})();