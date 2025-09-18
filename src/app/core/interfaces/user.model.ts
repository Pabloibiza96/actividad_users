export interface User {
  id: number;
  _id?: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  image: string;
}

export interface CreateUserRequest {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
}

export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  image?: string;
}