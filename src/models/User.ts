
export interface User {
  id: string;
  name: string;
  username: string;
  phone: string | null;
  role: "admin" | "proprietario" | "usuario";
  password: string;
  created_at: string;
}

export interface CreateUserData {
  name: string;
  username: string;
  phone: string | null;
  role: User["role"];
  password: string;
}

export interface UpdateUserData {
  name: string;
  phone: string | null;
  role: User["role"];
}

// Add interface for user without password for auth context
export interface UserWithoutPassword {
  id: string;
  name: string;
  username: string;
  phone: string | null;
  role: "admin" | "proprietario" | "usuario";
  created_at: string;
}
