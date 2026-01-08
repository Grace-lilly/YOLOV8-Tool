import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useClerkAuth';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accessibility } from 'lucide-react';
import { useState } from 'react';

const Auth = () => {
  const { isSignedIn, loading } = useAuth();
  const [isSignIn, setIsSignIn] = useState(true);

  // Redirect if already authenticated
  if (isSignedIn) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-background">
        <div className="text-center space-y-4">
          <div className="animate-pulse-soft">
            <div className="h-12 w-12 bg-guide-primary rounded-full mx-auto animate-float"></div>
          </div>
          <p className="text-muted-foreground" aria-live="polite">
            Loading VisionGuide AI...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <header className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="p-3 bg-primary rounded-full animate-float">
              <Accessibility className="h-8 w-8 text-primary-foreground" aria-hidden="true" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              VisionGuide AI
            </h1>
            <p className="text-muted-foreground mt-2">
              Navigate with confidence using AI-powered assistance
            </p>
          </div>
        </header>

        {/* Auth Form */}
        <Card className="bg-gradient-card border-border/50 shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl text-center">
              {isSignIn ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription className="text-center">
              {isSignIn 
                ? 'Sign in to access your VisionGuide AI dashboard'
                : 'Join VisionGuide AI to start navigating with confidence'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={isSignIn ? 'signin' : 'signup'} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger 
                  value="signin" 
                  onClick={() => setIsSignIn(true)}
                  className="text-sm font-medium"
                  aria-label="Switch to sign in"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  onClick={() => setIsSignIn(false)}
                  className="text-sm font-medium"
                  aria-label="Switch to sign up"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <div className="flex justify-center">
                  <SignIn 
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "bg-transparent shadow-none border-none",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden",
                        socialButtonsBlockButton: "bg-background border-input hover:bg-accent",
                        formButtonPrimary: "bg-primary hover:bg-primary-hover text-primary-foreground",
                        formFieldInput: "bg-background border-input focus:border-ring",
                        footerActionLink: "text-primary hover:text-primary-hover"
                      }
                    }}
                    redirectUrl="/"
                  />
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <div className="flex justify-center">
                  <SignUp 
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "bg-transparent shadow-none border-none",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden",
                        socialButtonsBlockButton: "bg-background border-input hover:bg-accent",
                        formButtonPrimary: "bg-primary hover:bg-primary-hover text-primary-foreground",
                        formFieldInput: "bg-background border-input focus:border-ring",
                        footerActionLink: "text-primary hover:text-primary-hover"
                      }
                    }}
                    redirectUrl="/"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground">
          <p>
            By using VisionGuide AI, you agree to prioritize safety and independence
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Auth;