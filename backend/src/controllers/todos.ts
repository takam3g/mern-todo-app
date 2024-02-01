import { RequestHandler } from 'express';
import mongoose from 'mongoose';

import TodoModel from '../models/todo';
import createHttpError from 'http-errors';

export const getTodos: RequestHandler = async (req, res, next) => {
  try {
    const todos = await TodoModel.find().exec();
    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
};

export const getTodo: RequestHandler = async (req, res, next) => {
  const todoId = req.params.todoId;

  try {
    if (!mongoose.isValidObjectId(todoId)) {
      throw createHttpError(400, 'Invalid todo id');
    }

    const todo = await TodoModel.findById(todoId).exec();

    if (!todo) {
      throw createHttpError(404, 'Todo not found');
    }

    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
};

interface PostTodoBody {
  text?: string;
  isCompleted?: boolean;
}

export const postTodo: RequestHandler<
  unknown,
  unknown,
  PostTodoBody,
  unknown
> = async (req, res, next) => {
  const text = req.body.text;
  const isCompleted = req.body.isCompleted;

  try {
    if (!text) {
      throw createHttpError(400, 'Text is required');
    }

    const newTodo = await TodoModel.create({
      text: text,
      isCompleted: isCompleted,
    });
    res.status(201).json(newTodo);
  } catch (error) {
    next(error);
  }
};

interface UpdateTodoParams {
  todoId: string;
}

interface UpdateTodoBody {
  text?: string;
  isCompleted?: boolean;
}

export const updateTodo: RequestHandler<UpdateTodoParams, unknown, UpdateTodoBody, unknown> = async (req, res, next) => {
  const todoId = req.params.todoId;
  const newText = req.body.text;
  const newIsCompleted = req.body.isCompleted;

  try {
    if (!mongoose.isValidObjectId(todoId)) {
      throw createHttpError(400, 'Invalid todo id');
    }

    if (!newText) {
      throw createHttpError(400, 'Text is required');
    }

    if (newIsCompleted === undefined) {
      throw createHttpError(400, 'isCompleted is required');
    }

    const todo = await TodoModel.findById(todoId).exec();

    if (!todo) {
      throw createHttpError(404, 'Todo not found');
    }

    todo.text = newText;
    todo.isCompleted = newIsCompleted;

    const updatedTodo = await todo.save();
    res.status(200).json(updatedTodo);
  } catch (error) {
    next(error);
  }
};

export const deleteTodo: RequestHandler = async (req, res, next) => {
  const todoId = req.params.todoId;

  try {
    if (!mongoose.isValidObjectId(todoId)) {
      throw createHttpError(400, 'Invalid todo id');
    }

    const todo = await TodoModel.findById(todoId).exec();

    if (!todo) {
      throw createHttpError(404, 'Todo not found');
    }

    await todo.deleteOne();
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}