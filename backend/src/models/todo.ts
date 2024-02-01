import { InferSchemaType, Schema, model } from 'mongoose';

const todoSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

type Todo = InferSchemaType<typeof todoSchema>;

export default model<Todo>('Todo', todoSchema);