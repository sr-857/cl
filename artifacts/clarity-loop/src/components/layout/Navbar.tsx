import { Link, useLocation } from "wouter";
import { BookOpen, Home, LayoutDashboard, LogOut, Sparkles, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";

export function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <div className="bg-primary/10 p-2 rounded-xl">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:inline-block">
            Clarity Loop
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-muted ${
              location === "/" ? "bg-primary/5 text-primary" : "text-muted-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </span>
          </Link>

          {user && (
            <Link
              href="/library"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-muted ${
                location.startsWith("/library") || location.startsWith("/reader")
                  ? "bg-primary/5 text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Library</span>
              </span>
            </Link>
          )}

          {user?.role === "student" && (
            <Link
              href="/student-dashboard"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-muted ${
                location === "/student-dashboard" ? "bg-primary/5 text-primary" : "text-muted-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </span>
            </Link>
          )}

          {user?.role === "teacher" && (
            <Link
              href="/teacher-dashboard"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-muted ${
                location === "/teacher-dashboard" ? "bg-primary/5 text-primary" : "text-muted-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </span>
            </Link>
          )}
        </nav>

        {/* Right side: theme toggle + user actions */}
        <div className="flex items-center gap-2">
          {/* Dark / Light mode toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="text-muted-foreground hover:text-foreground rounded-full"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-semibold leading-none">{user.name}</span>
                <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => logout()}
                title="Logout"
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link href="/auth">
              <Button className="rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                Get Started
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
