// Serviço simples de sessão usando localStorage
import { User } from "@/models/User";

const SESSION_KEY = "bingo_user";

export const sessionService = {
  setUser(user: Omit<User, "password">) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  },
  getUser(): Omit<User, "password"> | null {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  },
  clear() {
    localStorage.removeItem(SESSION_KEY);
  },
};
