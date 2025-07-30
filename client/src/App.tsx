import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import Landing from "@/pages/Landing";
import CharacterCreation from "@/pages/CharacterCreation";
import Dashboard from "@/pages/Dashboard";
import Chat from "@/pages/Chat";
import NotFound from "@/pages/not-found";
import FloatingElements from "@/components/FloatingElements";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/create" component={CharacterCreation} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/chat/:id" component={Chat} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-gradient-creative dark:bg-gradient-to-br dark:from-gray-900 dark:via-purple-900 dark:to-violet-900 transition-all duration-500">
            <FloatingElements />
            <Toaster />
            <Router />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
