'use strict';

const config = require('../config/auth')
const DarkSky = require('dark-sky')
const googleMap = require('@google/maps')

const forecast = new DarkSky(config.darkSky.apiKey);
const googleMapClient = googleMap.createClient({
    key: config.googleMap.apiKey
});

var getForecast = function (address) {
    return new Promise(function (resolve, reject) {
        getLatitudeAndLongitude(address)
            .then(function (geoResult) {
                return forecast
                        .latitude(geoResult[0].geometry.location.lat)
                        .longitude(geoResult[0].geometry.location.lng)
                        .get()
            })
            .then(function (forecastResult) {
                resolve(forecastResult);
            })
            .catch(function (err) {
                reject(err);
            });
    });
}

var getLatitudeAndLongitude = function (address) {
    return new Promise(function (resolve, reject) {
        googleMapClient.geocode({
            address: address
        }, function (err, response) {
            if (!err) {
                resolve(response.json.results);
            }

            reject(err);
        });
    });
}

module.exports = {
    'getForecast': getForecast
};