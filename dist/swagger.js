"use strict";
var swaggerAutogen = require('swagger-autogen')();
var outputFile = './swagger_output.json';
var endpointsFiles = ['./index.ts'];
swaggerAutogen(outputFile, endpointsFiles);
