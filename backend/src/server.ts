import mongoose from 'mongoose';

import app from './app';
import env from './util/validateEnv';

const PORT = env.PORT;

const mongoDB = env.MONGO_CONNECTION_STRING;

mongoose
  .connect(mongoDB)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log('Listening on port: ' + PORT);
    });
  })
  .catch(console.error);
