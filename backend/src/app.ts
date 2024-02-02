import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import createHttpError, { isHttpError } from 'http-errors';
import session from 'express-session';
import MongoStore from 'connect-mongo';

import usersRoutes from './routes/users';
import todosRoutes from './routes/todos';
import env from './util/validateEnv';

const app = express();

app.use(morgan('dev'));

//Make it possible to read the data urlencoded and in JSON format sent by client
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000, // 1 hour
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: env.MONGO_CONNECTION_STRING,
    }),
  })
);

app.use('/api/users', usersRoutes);
app.use('/api/todos', todosRoutes);

app.use((req, res, next) => {
  next(createHttpError(404, 'Endpoint not found'));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let statusCode = 500;
  let errorMessage = 'Unknow error occured';
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

export default app;
