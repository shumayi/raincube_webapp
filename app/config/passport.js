var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var LocalStrategy = require('passport-local');
var FacebookStrategy = require('passport-facebook').Strategy;
 
// load up the user model
var User = require('../models/user');
var dbConfig = require('../config/database'); // get db config file
var authConfig = require('../config/auth');

var jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: dbConfig.secret
};
var jwtLogin = new JwtStrategy(jwtOptions, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.id}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});

var localOptions = {
    usernameField: 'username',
    passwordFiled: 'password'
};
var localLogin = new LocalStrategy(localOptions, function (email, password, done) {
    User.findOne({ email: email }, function (err, user) {
        if (err) {
            return done(err);
        }

        if (!user) {
            return done(null, false, { error: 'Your login details could not be verified. Please try again.' });
        }

        user.comparePassword(password, function (err, isMatch) {
            if (err) {
                return done(err);
            }

            if (!isMatch) {
                return done(null, false, { error: 'Your login details could not be verified. Please try again.' });
            }

            return done(null, user);
        });
    });
});

var facebookOptions = {
    clientID: authConfig.facebookAuth.clientID,
    clientSecret: authConfig.facebookAuth.clientSecret,
    callbackURL: authConfig.facebookAuth.callbackURL
}

var facebookLogin = new FacebookStrategy(facebookOptions, function (token, refreshToken, profile, done) {
    process.nextTick(function() {
        User.findOne({ 'facebook.id': profile.id }, function (err, user) {
            if (err)
                return done(err);

            if (user) {
                return done(null, user); // user found, return that user
            } else {
                // if there is no user found with that facebook id, create them
                var newUser            = new User();

                // set all of the facebook information in our user model
                newUser.facebook.id    = profile.id; // set the users facebook id                   
                newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                // save our user to the database
                newUser.save(function(err) {
                    if (err)
                        throw err;

                    // if successful, return the new user
                    return done(null, newUser);
                });
            }
        });
    });
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


passport.use(jwtLogin);
passport.use(localLogin);
passport.use(facebookLogin);