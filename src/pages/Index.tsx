import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/auth/LoginForm";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return <LoginForm onSuccess={() => navigate('/dashboard')} />;
};

export default Index;
