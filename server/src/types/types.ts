export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
};

export type RegisterRequestBody = {
  username: string;
  email: string;
  password: string;
};

export type LoginRequestBody = {
  email: string;
  password: string;
};

export type AuthResponse = {
  success: boolean;
  message: string;
  token?: string;
};

export type Task = {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  status: "todo" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
};
