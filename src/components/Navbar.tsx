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
    <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* --- Brand / Logo --- */}
        <Link
          to={brandHref}
          className="flex items-center gap-2 font-bold text-lg group"
        >
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
            <img
              src="/brain_hop.png"
              alt="Brain Hop Logo"
              className="w-8 h-12 object-cover object-top -mt-0.5 group-hover:scale-105 transition-transform duration-200"
            />
          </div>
          <span className="text-foreground tracking-[-.03em]">
            Brain<span className="ml-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Hop</span>
          </span>
        </Link>

        {/* --- Right side buttons --- */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {!isAuthenticated ? (
            <>
              <Button variant="ghost" asChild className="rounded-full">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="rounded-full bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-950">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild className="rounded-full">
                <Link to="/models">Models</Link>
              </Button>
              <Button variant={isOnChat ? "default" : "ghost"} asChild className="rounded-full">
                <Link to="/chat">Chat</Link>
              </Button>
              <Button variant="ghost" asChild className="rounded-full">
                <Link to="/profile">Profile</Link>
              </Button>
              <Button variant="outline" asChild className="rounded-full">
                <Link to="/logout">Logout</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
