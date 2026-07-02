'use strict';

const APP_NAME = process.env.APP_NAME || 'sambrid-app';
const BASE_PREFIX = process.env.BASE_PREFIX || '/sambrid'; // must match ALB path_pattern minus the wildcard

const config = {
  port: process.env.PORT || 5000, // matches container_port in tfvars
  host: process.env.HOST || '0.0.0.0', // '0.0.0.0' not 'localhost' — must bind all interfaces to be reachable inside the ECS task/ALB target group
  env: process.env.NODE_ENV || 'development',
  appName: APP_NAME,

  api: {
    basePath: `${BASE_PREFIX}/api/v1`,
    docsPath: `${BASE_PREFIX}/api-docs`,
  },

  cors: {
    origin: process.env.CORS_ORIGIN || 'http://concproject-alb-1190008323.ap-south-1.elb.amazonaws.com',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
};

module.exports = config;