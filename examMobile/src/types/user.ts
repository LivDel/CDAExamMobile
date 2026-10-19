/**
 * Types TypeScript relatifs aux utilisateurs et à la session
 */

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UserAccount extends User {
  password: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
}

