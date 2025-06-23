
import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { UserWithoutPassword } from "@/models/User";
import { sessionService } from "@/services/sessionService";

interface AuthContextType {
  user: UserWithoutPassword | null;
  loading: boolean;
  signOut: () => void;
  login: (user: UserWithoutPassword) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserWithoutPassword | null>(null);
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

  const login = (user: UserWithoutPassword) => {
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
