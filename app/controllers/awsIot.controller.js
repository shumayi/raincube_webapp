'use strict';

const config = require('../config/auth')
const awsIot = require('aws-iot-device-sdk')

const TOPIC = 'raincube_pi'

function createAwsIotClient () {
    var device = awsIot.device({
        keyPath: config.awsIot.keyPath,
        certPath: config.awsIot.certPath,
        caPath: config.awsIot.caPath,
        clientId: config.awsIot.clientId,
        host: config.awsIot.host,
        port: config.awsIot.port
    });

    device
        .on('connect', function() {
            device.subscribe(TOPIC);
        });
        
    device
        .on('message', function(topic, payload) {
            console.log('message', topic, payload.toString());
        });

    return device;
}

function composeMessage(from, to, actionType, data) {
    return {
        from: from,
        to: to,
        type: actionType,
        data: data
    };
}

var getIoTData = function () {
    var device = createAwsIotClient();
    var message = composeMessage('server', 'RC00000000995cdc89', 'action', 'OP10001');

    return new Promise(function (resolve, reject) {
        device.publish(TOPIC, JSON.stringify(message), function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

var openChannel = function (channel) {
    var device = createAwsIotClient();
    var message = composeMessage('server', 'RC00000000995cdc89', 'action', 'OP' + channel + '1400');

    return new Promise(function (resolve, reject) {
        device.publish(TOPIC, JSON.stringify(message), function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

var closeChannel = function (channel) {
    var device = createAwsIotClient();
    var message = composeMessage('server', 'RC00000000995cdc89', 'action', 'CL' + channel + '1400');

    return new Promise(function (resolve, reject) {
        device.publish(TOPIC, JSON.stringify(message), function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

module.exports = {
    'getIoTData': getIoTData,
    'openChannel': openChannel,
    'closeChannel': closeChannel
};