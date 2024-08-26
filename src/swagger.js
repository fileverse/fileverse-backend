const swaggerAutogen = require('swagger-autogen')();
const config = require('../config');

const port = config.PORT || 8001;
const ip = config.IP || '127.0.0.1';

const doc = {
  info: {
    title: 'Fileverse Backend',
    description: '',
  },
  host: `http://${ip}:${port}`, // Change this to your server's host
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js']; // Path to your main file or route files

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./server'); // Your project's root file
});
