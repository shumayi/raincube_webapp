var AuthenticationController = require('./app/controllers/authentication.controller');
var express = require('express');
var passport = require('passport');
var passportService = require('./app/config/passport');

// Middleware to require login/auth
var requireAuth = passport.authenticate('jwt', { session: false });
var requireLogin = passport.authenticate('local', { session: false });
var facebookLogin = passport.authenticate('facebook', { scope: 'email' });

module.exports = function (app, passport) {

    //Login Routes
    app.get('/', function (req, res) {
        res.sendFile(__dirname + '/views/login.html');
    });

    app.post('/login', requireLogin, AuthenticationController.login);

    //Logout
    app.get('/logout', function (req, res) {
        res.redirect('/');
    });

    //Signup Routes
    app.get('/signup', function (req, res) {
        res.sendFile(__dirname + '/views/signup.html');
    });

    app.post('/signup', AuthenticationController.register);

    //Facebook Routes
    app.get('/auth/facebook', facebookLogin);

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/dashboard',
            failureRedirect : '/'
        }));

    //Dashboards Route
    app.get('/dashboard', function (req, res) {
        res.sendFile(__dirname + '/views/dashboard.html');
    });

    //MONITOR DE CONEXIONES.
    app.get('/monitor', requireAuth, function (req, res) {
        res.sendFile(__dirname + '/views/monitor.html');
    });

    //404
    app.get('*', function (req, res) {
        res.status(404).sendFile(__dirname + '/views/404.html');
    });
};