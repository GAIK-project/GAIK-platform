export type LoginState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
};

export type AuthUser = {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    organization?: string;
    role?: string;
  };
};
