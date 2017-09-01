var User = require('../models/user'); // get the mongoose model

var getUserProfile = function (email) {
    return new Promise(function (resolve, reject) {
        User.findOne({email: email})
            .then(function (user) {
                var userProfile = {
                    firstName: user.profile.firstName,
                    lastName: user.profile.lastName,
                    email: user.email,
                    address: user.address,
                    devices: user.devices
                };

                resolve(userProfile);
            })
            .catch(function (err) {
                reject(err);
            });
    });
}

module.exports = {
    'getUserProfile': getUserProfile
};