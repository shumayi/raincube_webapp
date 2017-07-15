module.exports = {
    'facebookAuth': {
        'clientID': '1530901950539097',
        'clientSecret': 'a4e8f93de7ba7714045d469d91eb67d8',
        'callbackURL': 'http://localhost:8000/auth/facebook/callback',
        'profileFields': ['id', 'displayName', 'email', 'name']
    },
    'googleMap': {
        'apiKey': 'AIzaSyCN2btXyORn-zMPa_F8sGS4aCLLF6NiZWM'
    },
    'darkSky': {
        'apiKey': '211484f74e6543542ad432b865c3291f'
    },
    'awsIot': {
        'keyPath': '/Users/tommywu/Documents/raincube_pi/cert/c3daaa6759-private.pem.key',
        'certPath': '/Users/tommywu/Documents/raincube_pi/cert/c3daaa6759-certificate.pem.crt',
        'caPath': '/Users/tommywu/Documents/raincube_pi/cert/root_ca.crt',
        'clientId': 'raincube_pi',
        'host': 'a20mpokpemb1wi.iot.us-east-1.amazonaws.com',
        'port': 8883,
        'status_interval': 10,
        'hcsr04_trig': 16,
        'hcsr04_echo': 18,
        'pump': 31,
        'channel_1': 37,
        'channel_2': 35,
        'channel_3': 33
    }
};