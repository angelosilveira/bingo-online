import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { User } from "@/models/User";
import { sessionService } from "@/services/sessionService";

interface AuthContextType {
  user: Omit<User, "password"> | null;
  loading: boolean;
  signOut: () => void;
  login: (user: Omit<User, "password">) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Omit<User, "password"> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carrega o usuário do localStorage apenas uma vez na montagem
    const storedUser = sessionService.getUser();
    setUser(storedUser);
    setLoading(false);
  }, []);

  const signOut = () => {
    sessionService.clear();
    setUser(null);
  };

  const login = (user: Omit<User, "password">) => {
    sessionService.setUser(user);
    setUser(user);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
