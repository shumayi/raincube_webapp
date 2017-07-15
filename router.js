var AuthenticationController = require('./app/controllers/authentication.controller');
var WeatherController = require('./app/controllers/weather.controller');
var AWSIoTController = require('./app/controllers/awsIot.controller');
var express = require('express');
var passport = require('passport');
var passportService = require('./app/config/passport');

// Middleware to require login/auth
var requireAuth = passport.authenticate('jwt', { session: false });
var requireLogin = passport.authenticate('local', { session: false });
var facebookLogin = passport.authenticate('facebook', { scope: ['email', 'public_profile'] });

module.exports = function (app, passport) {

    //Login Routes
    app.post('/login', requireLogin, AuthenticationController.login);

    //Logout
    app.get('/logout', function (req, res) {
        res.redirect('/');
    });

    //Signup Routes
    app.post('/register', AuthenticationController.register);

    //Facebook Routes
    app.get('/auth/facebook', facebookLogin);

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            session: false,
            failureRedirect : '/'
        }), AuthenticationController.facebookLogin);

    // Get real-time weather/forecast information
    app.get('/forecast/:zipCode', function (req, res) {
        if (!req.params.zipCode) {
            res.send('Please enter the zip code.');
        }

        WeatherController.getForecast(req.params.zipCode)
            .then(function (forecastResult) {
                res.send(forecastResult);
            })
            .catch(function (err) {
                res.send('Unable to get the forecast information.')
            });
    });

    // app.get('/awsiot', function (req, res) {
    //     AWSIoTController.getIoTData()
    //         .then(function (result) {
    //             res.send(result);
    //         })
    //         .catch(function (err){
    //             res.send('Unable to retrieve data from IoT device.');
    //         });
    // });

    //Dashboards Route
    // app.get('/dashboard', function (req, res) {
    //     res.sendFile(__dirname + '/views/dashboard.html');
    // });

    //MONITOR DE CONEXIONES.
    app.get('/monitor', requireAuth, function (req, res) {
        res.sendFile(__dirname + '/views/monitor.html');
    });
};