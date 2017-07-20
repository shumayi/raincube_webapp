(function() {
  
  angular
    .module('raincubeApp')
    .controller('dashboardCtrl', dashboardCtrl);

  dashboardCtrl.$inject = ['$location', 'weather'];
  function dashboardCtrl($location, weather) {
    var vm = this;

    vm.forecasts = [];
    vm.timeInterval = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

    var weatherIcons = {
        "rain": "./images/rc_raining.svg",
        "heavyRain": "./images/rc_heavy_rain.svg",
        "lightning": "./images/rc_lightning.svg",
        "overcast": "./images/rc_overcast.svg",
        "sunny": "./images/rc_sunny.svg",
        "windy": "./images/rc_windy.svg"
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

    vm.setTime = function (time) {
        vm.timeLength = time;
    }
  }

})();