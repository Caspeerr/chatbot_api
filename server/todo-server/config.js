'use strict';

const APP_NAME = process.env.APP_NAME || 'sambrid-app';


const config = {
  port: process.env.PORT || 5000, // matches container_port in tfvars
  host: process.env.HOST || '0.0.0.0', // must bind all interfaces, not 'localhost', to be reachable from the ALB/ECS network
  env: process.env.NODE_ENV || 'development',
  appName: APP_NAME,

  api: {
    basePath: `/sambrid/api/v1`,
    docsPath: `/sambrid/api-docs`,//api docs
  },

  cors: {
    origin: process.env.CORS_ORIGIN || 'http://concproject-alb-1190008323.ap-south-1.elb.amazonaws.com',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
};

module.exports = config;