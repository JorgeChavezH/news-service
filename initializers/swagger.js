const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'News service',
      version: '1.0.0',
      description: 'A service to manage the news database and provide a news feed to the user',
    },
  },
  apis: ['./controllers/*.js'], 
};

const specs = swaggerJsdoc(options);

global.swagger = specs;
