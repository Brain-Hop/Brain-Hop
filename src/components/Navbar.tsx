import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const brandHref = isAuthenticated ? "/chat" : "/";
  const isOnChat = location.pathname === "/chat";

  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* --- Brand / Logo --- */}
        <Link
          to={brandHref}
          className="flex items-center gap-2 font-semibold text-lg group"
        >
          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center overflow-hidden">
  <img
    src="/brain_hop.png"
    alt="Brain Hop Logo"
    className="h-20 w-10 object-contain transition-transform duration-200 group-hover:scale-105"
  />
</div>

          <span className="text-foreground">Brain Hop</span>
        </Link>

        {/* --- Right side buttons --- */}
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
              <Button variant={isOnChat ? "default" : "ghost"} asChild>
                <Link to="/chat">Chat</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/profile">Profile</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/logout">Logout</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
