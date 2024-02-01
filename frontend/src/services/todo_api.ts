import { ToDo as ToDoModel } from '../models/todo';

async function fetchData(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  const response = await fetch(input, init);
  if (!response.ok) {
    const errorBody = await response.json();
    const errorMessage = errorBody.error;
    throw new Error(errorMessage);
  }
  return response;
}

export async function fetchToDos(): Promise<ToDoModel[]> {
  const response = await fetchData('/api/todos', {
    method: 'GET',
  });
  return response.json();
}

export interface ToDoInput {
  text: string;
  isCompleted: boolean;
}

export async function createToDo(todo: ToDoInput): Promise<ToDoModel> {
  const response = await fetchData('/api/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todo),
  });
  return response.json();
}

export async function deleteToDo(todoId: string) {
  await fetchData(`/api/todos/${todoId}`, {
    method: 'DELETE',
  });
}

export async function updateToDo(
  todoId: string,
  todo: ToDoInput
): Promise<ToDoModel> {
  const response = await fetchData(`/api/todos/${todoId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todo),
  });
  return response.json();
}
