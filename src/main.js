// server
import { app } from './app/app.js'
import { PORT } from './config/config.js'
import { connect } from './database/database.js'
import Logger from './utils/logger.js';

await connect()

app.listen(PORT, () => {
  Logger.info(`Server listening in port: ${PORT}`);
  // console.log(`Server listening in port: ${PORT}`);
});