import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';

import UserModel from '../models/user';

export const isUserAuthenticated: RequestHandler = async (req, res, next) => {
  const getAuthenticatedUserId = req.session.userId;

  try {
    if (!getAuthenticatedUserId) {
      throw createHttpError(401, 'Uer is not authenticated');
    }

    const user = await UserModel.findById(getAuthenticatedUserId)
      .select('+email')
      .exec();

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

interface SignUpBody {
  username?: string;
  email?: string;
  password?: string;
}

export const signUp: RequestHandler<
  unknown,
  unknown,
  SignUpBody,
  unknown
> = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const rawPassword = req.body.password;

  try {
    if (!username || !email || !rawPassword) {
      throw createHttpError(400, 'Required input is missing');
    }

    const existingUsername = await UserModel.findOne({
      username: username,
    }).exec();
    const existingEmail = await UserModel.findOne({ email: email }).exec();

    if (existingUsername) {
      throw createHttpError(
        400,
        'Username already taken. Please choose another one.'
      );
    }

    if (existingEmail) {
      throw createHttpError(400, 'Email already exists');
    }

    const passwordHashed = await bcrypt.hash(rawPassword, 10);

    const newUser = await UserModel.create({
      username: username,
      email: email,
      password: passwordHashed,
    });

    req.session.userId = newUser._id;

    const newUserToReturn = {
      username: newUser.username,
      email: newUser.email,
    };

    res.status(201).json(newUserToReturn);
  } catch (error) {
    next(error);
  }
};

interface SignInBody {
  username?: string;
  password?: string;
}

export const signIn: RequestHandler<
  unknown,
  unknown,
  SignInBody,
  unknown
> = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    if (!username || !password) {
      throw createHttpError(400, 'Required input is missing');
    }

    const user = await UserModel.findOne({ username: username })
      .select('+email')
      .exec();

    if (!user) {
      throw createHttpError(401, 'Invalid username or password');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw createHttpError(401, 'Invalid username or password');
    }

    req.session.userId = user._id;

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const signOut: RequestHandler = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
    } else {
      res.sendStatus(200).json;
    }
  });
};
