global.mongoose = require('mongoose');

autoload(`${__dirname}/../models`)

mongoose.set('strictQuery', false);

const uri = config.db.uri;
mongoose.connect(uri).then(() => {logger.info('Connected to DB')}).catch((err) => { logger.error('Fail to connect to BD', err) });
