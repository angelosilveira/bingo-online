import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  console.log("🚀 ~ ProtectedRoute ~ user:", user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    // Evita renderizar qualquer coisa enquanto redireciona
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
