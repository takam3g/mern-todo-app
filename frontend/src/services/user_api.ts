import { User as UserModel } from '../models/user';
import { fetchData } from './fetchUtils';

export async function isUserSignedIn(): Promise<UserModel> {
  const response = await fetchData('/api/users', {
    method: 'GET',
  });
  return response.json();
}

export interface SignUpInput {
  username: string;
  email: string;
  password: string;
}

export async function signUp(user: SignUpInput): Promise<UserModel> {
  const response = await fetchData('/api/users/sign-up', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  return response.json();
}

export interface SignInInput {
  username: string;
  password: string;
}

export async function signIn(user: SignInInput): Promise<UserModel> {
  const response = await fetchData('/api/users/sign-in', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  return response.json();
}

export async function signOut() {
  await fetchData('/api/users/sign-out', {
    method: 'POST',
  });
}
