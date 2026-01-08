import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProvider } from '@clerk/clerk-react';
import { AuthProvider } from "@/hooks/useClerkAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Navigation from "@/components/layout/Navigation";
import Index from "./pages/Index";
import About from "./pages/About";
import VideoUpload from "./pages/VideoUpload";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const PUBLISHABLE_KEY = "pk_test_cHJlc2VudC1pbnNlY3QtOTYuY2xlcmsuYWNjb3VudHMuZGV2JA";

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Navigation />
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/about" element={
              <ProtectedRoute>
                <Navigation />
                <About />
              </ProtectedRoute>
            } />
            <Route path="/upload" element={
              <ProtectedRoute>
                <Navigation />
                <VideoUpload />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Navigation />
                <Profile />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
    </ClerkProvider>
  </QueryClientProvider>
);

export default App;
