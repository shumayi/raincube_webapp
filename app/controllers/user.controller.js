const User = require('../models/user'); // get the mongoose model

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

var updateUserProfile = function (userInfo) {
    return new Promise(function (resolve, rejeect) {
        User.findOne({email: userInfo.email})
            .then(function (user) {
                var updatedUser = {
                    address: {
                        street: userInfo.address.street,
                        city: userInfo.address.city,
                        state: userInfo.address.state,
                        zipCode: userInfo.address.zipCode
                    }
                };

                user.set(updatedUser);

                return user.save();
            })
            .then(function (saveResult) {
                resolve(saveResult);
            })
            .catch(function (err) {
                reject(err);
            });
    });
}

var removeDevice = function (userEmail, deviceId) {
    return new Promise(function (resolve, rejeect) {
        User.update( { email: userEmail }, { "$pull": { "devices": { "id": deviceId } } }, { safe: true })
            .then(function (res) {
                resolve(res);
            })
            .catch(function (err) {
                reject(err);
            });
    });
}

var addDevice = function (userEmail, device) {
    return new Promise(function (resolve, rejeect) {
        User.update( { email: userEmail }, { "$push": { "devices": device } }, { safe: true })
            .then(function (res) {
                resolve(res);
            })
            .catch(function (err) {
                reject(err);
            });
    });
};

var editDevice = function (userEmail, device) {
    return new Promise(function (resolve, rejeect) {
        User.update( 
            { 
                email: userEmail, 
                devices: { $elemMatch: { id: device.id }} 
            }, 
            { "$set": { "devices.$.name": device.name } }, { safe: true }
        )
            .then(function (res) {
                resolve(res);
            })
            .catch(function (err) {
                reject(err);
            });
    });
}

module.exports = {
    'getUserProfile': getUserProfile,
    'updateUserProfile': updateUserProfile,
    'removeDevice': removeDevice,
    "addDevice": addDevice,
    "editDevice": editDevice
};