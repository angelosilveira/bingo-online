export interface User {
  id: string;
  name: string;
  username: string;
  phone: string | null;
  role: "admin" | "proprietario" | "usuario";
  password: string; // novo campo password
  created_at: string;
}

export interface CreateUserData {
  name: string;
  username: string;
  phone: string | null;
  role: User["role"];
  password: string; // novo campo password
}

export interface UpdateUserData {
  name: string;
  phone: string | null;
  role: User["role"];
}
