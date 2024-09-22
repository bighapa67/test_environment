// Add custom type definitions here
export interface User {
  id: number;
  username: string;
  email: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}