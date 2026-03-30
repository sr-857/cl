import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Lazy-loaded pages for code splitting
const Home            = lazy(() => import("@/pages/Home"));
const Auth            = lazy(() => import("@/pages/Auth"));
const Library         = lazy(() => import("@/pages/Library"));
const Reader          = lazy(() => import("@/pages/Reader"));
const StudentDashboard = lazy(() => import("@/pages/StudentDashboard"));
const TeacherDashboard = lazy(() => import("@/pages/TeacherDashboard"));
const NotFound        = lazy(() => import("@/pages/not-found"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false },
  },
});

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar skeleton */}
      <div className="sticky top-0 z-40 h-16 border-b border-border/50 bg-background/80 backdrop-blur-md flex items-center px-8 gap-4">
        <div className="skeleton h-8 w-32 rounded-xl" />
        <div className="flex-1" />
        <div className="skeleton h-8 w-20 rounded-xl" />
      </div>
      {/* Content skeleton */}
      <div className="container mx-auto px-4 pt-16 space-y-6 max-w-3xl">
        <div className="skeleton h-12 w-3/4 rounded-2xl" />
        <div className="skeleton h-5 w-full rounded-xl" />
        <div className="skeleton h-5 w-5/6 rounded-xl" />
        <div className="skeleton h-5 w-4/6 rounded-xl" />
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-36 rounded-3xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Switch>
        <Route path="/"                    component={Home} />
        <Route path="/auth"                component={Auth} />
        <Route path="/library"             component={Library} />
        <Route path="/reader/:id"          component={Reader} />
        <Route path="/student-dashboard"   component={StudentDashboard} />
        <Route path="/teacher-dashboard"   component={TeacherDashboard} />
        <Route                             component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
