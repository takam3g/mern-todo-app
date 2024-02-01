import express from 'express';

import { getTodos, postTodo, getTodo, updateTodo, deleteTodo } from '../controllers/todos';

const router = express.Router();

router.get('/', getTodos);

router.get('/:todoId', getTodo);

router.post('/', postTodo);

router.patch('/:todoId', updateTodo);

router.delete('/:todoId', deleteTodo);

export default router;
