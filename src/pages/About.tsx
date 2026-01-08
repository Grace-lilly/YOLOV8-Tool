import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Eye, 
  Brain, 
  Volume2, 
  Shield, 
  Zap, 
  Navigation, 
  Upload,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Eye,
      title: "Advanced Computer Vision",
      description: "Our AI analyzes video footage to identify objects, people, obstacles, and safe pathways in real-time with high accuracy."
    },
    {
      icon: Brain,
      title: "Intelligent Scene Understanding",
      description: "Machine learning algorithms interpret complex environments, understanding spatial relationships and potential navigation challenges."
    },
    {
      icon: Volume2,
      title: "Audio Guidance System",
      description: "Clear, concise audio instructions provide turn-by-turn guidance and alert you to important environmental features."
    },
    {
      icon: Shield,
      title: "Safety-First Approach",
      description: "Every recommendation prioritizes your safety, identifying potential hazards and suggesting the safest possible routes."
    },
    {
      icon: Zap,
      title: "Fast Processing",
      description: "Quick video analysis means you get the guidance you need without long wait times, enabling real-world usability."
    },
    {
      icon: Navigation,
      title: "Precise Navigation",
      description: "Detailed spatial awareness helps you navigate both indoor and outdoor environments with confidence and independence."
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Upload Your Video",
      description: "Record a video of your environment using your smartphone or camera, then upload it to our secure platform."
    },
    {
      step: "2",
      title: "AI Analysis",
      description: "Our advanced computer vision algorithms analyze the video, identifying objects, obstacles, and safe pathways."
    },
    {
      step: "3",
      title: "Audio Guidance",
      description: "Receive detailed audio instructions that guide you safely through the environment you recorded."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Hero Section */}
          <section className="text-center space-y-6" aria-labelledby="about-heading">
            <div className="space-y-4">
              <h1 id="about-heading" className="text-4xl sm:text-5xl font-bold text-foreground animate-fade-in">
                Empowering Independent Navigation
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                VisionGuide AI combines cutting-edge computer vision technology with intelligent audio guidance 
                to help visually impaired individuals navigate their world with confidence and independence.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button 
                asChild
                size="lg" 
                className="btn-accessible bg-primary hover:bg-primary-hover text-primary-foreground min-w-[200px]"
              >
                <Link to="/upload" aria-describedby="try-now-desc">
                  <Upload className="h-5 w-5 mr-2" aria-hidden="true" />
                  Try It Now
                </Link>
              </Button>
              <p id="try-now-desc" className="sr-only">
                Upload a video to experience VisionGuide AI
              </p>
            </div>
          </section>

          {/* How It Works */}
          <section className="space-y-8" aria-labelledby="how-it-works-heading">
            <div className="text-center">
              <h2 id="how-it-works-heading" className="text-3xl font-bold text-foreground mb-4">
                How VisionGuide AI Works
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our three-step process transforms video footage into actionable navigation guidance
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {howItWorks.map((item, index) => (
                <Card 
                  key={item.step}
                  className="bg-gradient-card border-border/50 feature-card relative"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground mb-4 animate-pulse-soft">
                      {item.step}
                    </div>
                    <CardTitle className="text-xl font-semibold feature-title">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center feature-description leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                  
                  {/* Arrow connector (hidden on last item) */}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 text-primary animate-float">
                      <ArrowRight className="h-8 w-8" aria-hidden="true" />
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </section>

          {/* Features Grid */}
          <section className="space-y-8" aria-labelledby="features-heading">
            <div className="text-center">
              <h2 id="features-heading" className="text-3xl font-bold text-foreground mb-4">
                Powerful AI Features
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Advanced technology designed specifically for navigation assistance
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card 
                  key={feature.title}
                  className="bg-gradient-card border-border/50 feature-card h-full"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 feature-icon-bg rounded-lg">
                        <feature.icon 
                          className="h-6 w-6 feature-icon" 
                          aria-hidden="true"
                        />
                      </div>
                      <CardTitle className="text-lg font-semibold feature-title">
                        {feature.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="feature-description leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Benefits Section */}
          <section className="space-y-8" aria-labelledby="benefits-heading">
            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <h2 id="benefits-heading" className="text-3xl font-bold text-foreground">
                    Why Choose VisionGuide AI?
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-6 w-6 text-guide-success mt-1 flex-shrink-0" aria-hidden="true" />
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">Enhanced Independence</h3>
                          <p className="text-muted-foreground">Navigate new environments confidently with AI-powered assistance that adapts to your specific needs.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-6 w-6 text-guide-success mt-1 flex-shrink-0" aria-hidden="true" />
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">Improved Safety</h3>
                          <p className="text-muted-foreground">Advanced hazard detection and safe route planning help you avoid obstacles and dangerous areas.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-6 w-6 text-guide-success mt-1 flex-shrink-0" aria-hidden="true" />
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">Personalized Experience</h3>
                          <p className="text-muted-foreground">Tailored audio guidance that learns from your preferences and provides relevant environmental information.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-6 w-6 text-guide-success mt-1 flex-shrink-0" aria-hidden="true" />
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">Easy to Use</h3>
                          <p className="text-muted-foreground">Simple upload process with intuitive interface designed with accessibility as the top priority.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Call to Action */}
          <section className="text-center space-y-6" aria-labelledby="cta-heading">
            <div className="space-y-4">
              <h2 id="cta-heading" className="text-3xl font-bold text-foreground">
                Ready to Experience VisionGuide AI?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Start your journey toward greater independence and confidence in navigation today.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                asChild
                size="lg" 
                className="btn-accessible bg-primary hover:bg-primary-hover text-primary-foreground min-w-[200px]"
              >
                <Link to="/upload">
                  <Upload className="h-5 w-5 mr-2" aria-hidden="true" />
                  Upload Your First Video
                </Link>
              </Button>
              
              <Button 
                asChild
                variant="outline" 
                size="lg"
                className="btn-accessible min-w-[200px]"
              >
                <Link to="/profile">
                  <Eye className="h-5 w-5 mr-2" aria-hidden="true" />
                  View Your Profile
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;