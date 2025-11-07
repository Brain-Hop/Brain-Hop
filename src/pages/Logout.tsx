import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

const Logout = () => {
  const { logout } = useAuth();

  useEffect(() => {
    logout({ redirectTo: "/", silent: true });
  }, [logout]);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p>Signing you out...</p>
        </div>
      </div>
    </div>
  );
};

export default Logout;

