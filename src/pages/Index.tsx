import { useAuth } from '@/hooks/useClerkAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accessibility, Navigation, Eye, Shield, LogOut } from 'lucide-react';

const Index = () => {
  const { user, signOut } = useAuth();

  const features = [
    {
      icon: Navigation,
      title: "Smart Navigation",
      description: "AI-powered route guidance and obstacle detection for safe indoor and outdoor navigation"
    },
    {
      icon: Eye,
      title: "Scene Recognition",
      description: "Advanced computer vision to identify and describe your environment in real-time"
    },
    {
      icon: Shield,
      title: "Safety First",
      description: "Proactive alerts for potential hazards and safe path recommendations"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome Section */}
          <section className="text-center space-y-4">
            <div className="animate-pulse-soft">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Welcome to VisionGuide AI
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Experience the future of navigation assistance. Our AI-powered platform 
                helps you navigate your environment with confidence and independence.
              </p>
            </div>
          </section>

          {/* Features Grid */}
          <section aria-labelledby="features-heading">
            <h3 id="features-heading" className="text-2xl font-semibold text-center mb-8">
              Powerful Features for Independent Navigation
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card 
                  key={feature.title}
                  className="bg-gradient-card border-border/50 feature-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto p-3 feature-icon-bg rounded-full w-fit mb-3">
                      <feature.icon 
                        className="h-8 w-8 feature-icon" 
                        aria-hidden="true"
                      />
                    </div>
                    <CardTitle className="text-lg font-semibold feature-title">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center feature-description leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Quick Actions */}
          <section className="space-y-6" aria-labelledby="actions-heading">
            <h3 id="actions-heading" className="text-2xl font-semibold text-center">
              Getting Started
            </h3>
            
            <Card className="bg-gradient-card border-border/50 card-hover">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="space-y-3">
                    <h4 className="text-xl font-semibold text-foreground">
                      Ready to Navigate?
                    </h4>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                      Start your journey with VisionGuide AI. Our intelligent system is ready 
                      to assist you with real-time navigation guidance and environmental awareness.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button 
                      size="lg" 
                      className="btn-accessible bg-primary hover:bg-primary-hover text-primary-foreground min-w-[200px]"
                      aria-describedby="start-navigation-desc"
                      onClick={() => window.location.href = '/upload'}
                    >
                      <Navigation className="h-5 w-5 mr-2" aria-hidden="true" />
                      Start Navigation
                    </Button>
                    <p id="start-navigation-desc" className="sr-only">
                      Begin using VisionGuide AI navigation assistance
                    </p>
                    
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="btn-accessible min-w-[200px]"
                      aria-describedby="learn-features-desc"
                      onClick={() => window.location.href = '/about'}
                    >
                      <Eye className="h-5 w-5 mr-2" aria-hidden="true" />
                      Learn Features
                    </Button>
                    <p id="learn-features-desc" className="sr-only">
                      Explore VisionGuide AI features and capabilities
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 VisionGuide AI. Empowering independence through intelligent navigation.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
