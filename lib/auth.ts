export type AuthCreator = {
  handle: string;
  display_name: string;
};

export type AuthState = {
  user: { id: string; email: string } | null;
  creator: AuthCreator | null;
  isAdmin: boolean;
};

export function useAuth(): AuthState {
  return { user: null, creator: null, isAdmin: false };
}
