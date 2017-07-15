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
            console.log('connect');
            device.subscribe(TOPIC);
        });
        
    device
        .on('message', function(topic, payload) {
            console.log('message', topic, payload.toString());
        });

    return device;
}

function composeMessage() {
    return {
        from: 'server',
        to: 'RC00000000995cdc89',
        type: 'action',
        data: 'OP10001'
    };
}

var getIoTData = function () {
    var device = createAwsIotClient();
    var message = composeMessage();

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
    'getIoTData': getIoTData
};