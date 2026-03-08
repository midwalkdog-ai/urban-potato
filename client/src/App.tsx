import { useAuth } from "@/_core/hooks/useAuth";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { DataProvider } from "./contexts/DataContext";
import AuthScreen from "./pages/AuthScreen";
import Dashboard from "./pages/Dashboard";
import { Loader2 } from "lucide-react";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'property_manager' | 'subcontractor' | 'homeowner';
}

export interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

function App() {
  const { user: authUser, loading, logout: authLogout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  // Map OAuth user to dashboard user format
  const dashboardUser: User | null = authUser ? {
    id: authUser.id.toString(),
    email: authUser.email || '',
    full_name: authUser.name || '',
    role: (authUser.role === 'admin' ? 'admin' : 'property_manager') as any,
  } : null;

  const handleLogout = async () => {
    await authLogout();
  };

  return (
    <ErrorBoundary>
      <DataProvider>
        <ThemeProvider defaultTheme="dark">
          <TooltipProvider>
            <Toaster />
            {!dashboardUser ? (
              <AuthScreen onLogin={() => {}} />
            ) : (
              <Dashboard user={dashboardUser} onLogout={handleLogout} />
            )}
          </TooltipProvider>
        </ThemeProvider>
      </DataProvider>
    </ErrorBoundary>
  );
}

export default App;
