(function() {
  
  angular
    .module('raincubeApp')
    .controller('dashboardCtrl', dashboardCtrl);

  dashboardCtrl.$inject = ['$scope', '$interval', '$location', 'weather', 'awsIot', 'profile'];
  function dashboardCtrl($scope, $interval, $location, weather, awsIot, profile) {
    var vm = this;

    var weatherIcons = {
        "rain": "./images/rc_raining.svg",
        "heavyRain": "./images/rc_heavy_rain.svg",
        "lightning": "./images/rc_lightning.svg",
        "overcast": "./images/rc_overcast.svg",
        "sunny": "./images/rc_sunny.svg",
        "windy": "./images/rc_windy.svg"
    }

    vm.waterLevel = 87;
    vm.forecasts = [];
    vm.timeLengths = [];
    vm.timeInterval = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

    // Open/close zones
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

        awsIot
            .openChannel(zone)
            .success(function(response) {
                stop[zone-1] = $interval(function () {
                    countdownTime--;

                    vm.zones[zone-1].countdownInSeconds = Math.floor(countdownTime % 60);
                    vm.zones[zone-1].countdownInMinutes = Math.floor((countdownTime / 60) % 60);

                    if (countdownTime <= 0) {
                        vm.stopCountdown(stop[zone-1]);
                    }
                }, 1000);
            })
            .error(function (err) {
                console.log(err);
            });
    }

    vm.stopCountdown = function (zone) {
        awsIot
            .closeChannel(zone)
            .success(function(response) {
                if (angular.isDefined(stop[zone-1])) {
                    $interval.cancel(stop[zone-1]);
                    stop[zone-1] = undefined;
                }
            })
            .error(function (err) {
                console.log(err);
            });
    }

    // Line Chart
    vm.labels = ["JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    vm.series = ['GALLONS COLLECTED', 'Zone 1', 'Zone 2', 'Zone 3'];
    vm.chartData = [
        [150, 167, 148, 137, 120, 92],
        [36, 33, 25, 85, 120, 132],
        [71, 69, 76, 94, 115, 125],
        [63, 82, 76, 89, 103, 112]
    ];
    vm.datasetOverride = [
        { yAxisID: 'y-axis-1' }, 
        { yAxisID: 'y-axis-2' }, 
        { yAxisID: 'y-axis-3' }, 
        { yAxisID: 'y-axis-4' }
    ];
    vm.chartOptions = {
        scales: {
            yAxes: [
                {
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                },
                {
                    id: 'y-axis-2',
                    type: 'linear',
                    display: false,
                    position: 'left'
                },
                {
                    id: 'y-axis-3',
                    type: 'linear',
                    display: false,
                    position: 'left'
                },
                {
                    id: 'y-axis-4',
                    type: 'linear',
                    display: false,
                    position: 'left'
                }
            ]
        }
    };

    // Water Level
    var waterPercentage = 0;
    var waterLevelStop = $interval(function () {

        waterPercentage++;
        vm.waterLevel = waterPercentage;

        vm.transformWaterLevel = 'translate(0'+','+(100-waterPercentage)+'%)';

        if (waterPercentage === 87) {
            $interval.cancel(waterLevelStop);
        }
    }, 60);

    // Forecast data
    var zipCode = '33612';

    profile.getProfile()
    .success(function(data) {
        var user = data;
        var zipCode = '33612';

        if (user.address !== null) {
            zipCode = user.address.zipCode;
        }

        weather.getForecast(zipCode)
        .success(function(data) {
            setForecastData(data.daily.data);
        })
        .error(function (err) {
            console.log(err);
        });
    })
    .error(function (err) {
        console.log(err);

        weather.getForecast('33612')
        .success(function(data) {
            setForecastData(data.daily.data);
        })
        .error(function (err) {
            console.log(err);
        });
    });
    
    // Private methods
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