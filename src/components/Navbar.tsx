import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Bot } from "lucide-react";

interface NavbarProps {
  isAuthenticated?: boolean;
}

export function Navbar({ isAuthenticated = false }: NavbarProps) {
  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
          <Bot className="h-6 w-6 text-primary" />
          <span>AI Chat</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!isAuthenticated ? (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/models">Models</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/chat">Chat</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/profile">Profile</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
