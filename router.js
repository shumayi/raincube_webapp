var AuthenticationController = require('./app/controllers/authentication.controller');
var WeatherController = require('./app/controllers/weather.controller');
var AWSIoTController = require('./app/controllers/awsIot.controller');
var UserController = require('./app/controllers/user.controller');
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

    app.get('/userProfile', requireAuth, function (req, res) {
        var authorization = req.headers.authorization;
        var decoded;

        try {
            decoded = AuthenticationController.verifyUser(authorization);
        } catch (err) {
            res.status(401).send('unauthorized');
        }

        var userEmail = decoded.email;

        UserController.getUserProfile(userEmail)
            .then(function (user) {
                res.status(200).send(user);
            })
            .catch(function (err) {
                res.status(500).send('Unable to retrieve user profile');
            });
    });

    app.post('/updateProfile', requireAuth, function (req, res) {
        var user = req.body;

        UserController.updateUserProfile(user)
            .then(function (updateResult) {
                res.status(204).send(user);
            })
            .catch(function (err) {
                res.status(500).send("Unable to update user");
            });
    });

    // Get real-time weather/forecast information
    app.get('/forecast/:zipCode', requireAuth, function (req, res) {
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

    app.get('/awsIot', requireAuth, function (req, res) {
        AWSIoTController.getIoTData()
            .then(function (result) {
                res.send(result);
            })
            .catch(function (err){
                res.send('Unable to retrieve data from IoT device.');
            });
    });

    app.get('/openChannel/:channel', requireAuth, function (req, res) {
        if (!req.params.channel) {
            res.send('Please enter the zone number.');
        }

        AWSIoTController.openChannel(req.params.channel)
            .then(function (result) {
                res.send(result);
            })
            .catch(function (err){
                res.send('Unable to open zone ' + req.params.channel);
            });
    });

    app.get('/closeChannel/:channel', requireAuth, function (req, res) {
        if (!req.params.channel) {
            res.send('Please enter the zone number.');
        }

        AWSIoTController.closeChannel(req.params.channel)
            .then(function (result) {
                res.send(result);
            })
            .catch(function (err){
                res.send('Unable to close zone ' + req.params.channel);
            });
    });
};