'use strict'

const swaggerUi = require('swagger-ui-express');

global.currentEnv = process.env.NODE_ENV || 'dev';

global.autoload = require('auto-load');

const configs = autoload(`${__dirname}/config`);
global.utils = autoload(`${__dirname}/utils`);
global.config = configs[currentEnv];

autoload(`${__dirname}/initializers`);

global.business = autoload(`${__dirname}/business`);
global.dao = autoload(`${__dirname}/dao`);
global.clients = autoload(`${__dirname}/clients`);

global.projectInfo = require('./package.json');

global.express = require('express')
global.app = express();

app.use(express.json());

require('./router');

const port = config.api.port || 3000;
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger));

if (currentEnv !== 'test') {
    logger.info(`Using the "${currentEnv}" configuration.`);
  }

app.listen(port, () => {
    logger.info(`${projectInfo.name} listening at port ${port}.`);
})

module.exports = app;