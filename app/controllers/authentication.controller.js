var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var User = require('../models/user');
var config = require('../config/database');

function generateToken (user) {
    return jwt.sign(user, config.secret, {
        expiresIn: '1d'
    });
}

function setUserInfo (request) {
    var getUserInfo = {
        _id: require._id,
        firstName: request.profile.firstName,
        lastName: request.profile.lastName,
        email: request.email,
        role: request.role
    };

    return getUserInfo;
}

exports.login = function (req, res, next) {
    var userInfo = setUserInfo(req.user);

    res.status(200).json({
        toke: 'JWT ' + generateToken(userInfo),
        user: userInfo
    });
};

exports.register = function (req, res, next) {
    var username = req.body.email;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var password = req.body.password;

    if (!username) {
        return res.status(422).send({ error: 'You must enter an email address.' });
    }

    if (!firstName || !lastName) {
        return res.status(422).send({ error: 'You must enter your full name.' });
    }

    if (!password) {
        return res.status(422).send({ error: 'You must enter your password.' });
    }

    User.findOne({ email: username }, function (err, existingUser) {
        if (err) {
            return next(err);
        }

        if (existingUser) {
            return res.status(422).send({ error: 'The email address is already exist'});
        }

        var user = new User({
            email: username,
            password: password,
            profile: {
                firstName: firstName,
                lastName: lastName
            }
        });

        user.save(function (err) {
            if (err) {
                return next(err);
            }

            var userInfo = setUserInfo(user);

            res.status(201).json({
                toke: 'JWT ' + generateToken(userInfo),
                user: userInfo
            });
        });
    });
};

