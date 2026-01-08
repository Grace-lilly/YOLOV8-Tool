import { UserProfile } from '@clerk/clerk-react';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8">
        <div className="w-full max-w-6xl mx-auto bg-background rounded-lg shadow-lg overflow-hidden">
          <UserProfile 
  appearance={{
    elements: {
      rootBox: "w-full flex justify-center items-center min-h-screen", // center everything vertically and horizontally
      card: "w-full max-w-xl mx-auto shadow-lg border bg-background",  // restrict width, make sure only one card, add shadow
      profileSectionPrimaryButton: "bg-primary text-primary-foreground hover:bg-blue-700 transition-colors", // blue background for upload
      formButtonPrimary: "bg-primary text-primary-foreground hover:bg-blue-700 transition-colors", // blue for save/cancel
      formButtonSecondary: "border-input hover:bg-accent text-foreground",
      formFieldInput: "bg-background border-2 border-blue-500 text-foreground placeholder-blue-500 focus:border-primary focus:ring-2 focus:ring-primary", // visible border & placeholder for password inputs
      formFieldLabel: "text-foreground font-medium",
      // ... existing styles below unchanged ...
      navbar: "bg-muted/30 border-r border-border",
      navbarMobileMenuButton: "text-foreground",
      navbarMobileMenuRow: "hover:bg-accent",
      pageScrollBox: "bg-background",
      page: "bg-background",
      dividerRow: "bg-border",
      identityPreviewText: "text-foreground",
      identityPreviewEditButton: "text-muted-foreground hover:text-foreground transition-colors",
      profileSectionTitle: "text-foreground font-semibold",
      profileSectionContent: "text-muted-foreground",
      accordionTriggerButton: "text-foreground hover:bg-accent transition-colors",
      accordionContent: "bg-background",
      menuButton: "text-foreground hover:bg-accent transition-colors",
      menuList: "bg-background border-border shadow-lg",
      menuItem: "text-foreground hover:bg-accent transition-colors",
      alertText: "text-muted-foreground",
      badge: "bg-primary/10 text-primary border-primary/20",
      headerTitle: "text-foreground font-semibold",
      headerSubtitle: "text-muted-foreground",
      profileSection: "border-b border-border last:border-b-0",
      profileSectionItem: "py-4",
      navbarButton: "text-foreground hover:bg-accent transition-colors",
      activeNavbarButton: "bg-accent text-foreground",
    },
    variables: {
      colorPrimary: 'hsl(var(--primary))',
      colorBackground: 'hsl(var(--background))',
      colorInputBackground: 'hsl(var(--background))',
      colorInputText: 'hsl(var(--foreground))',
      colorText: 'hsl(var(--foreground))',
      colorTextSecondary: 'hsl(var(--muted-foreground))',
      colorNeutral: 'hsl(var(--muted))',
      colorDanger: 'hsl(var(--destructive))',
      colorSuccess: 'hsl(var(--primary))',
      colorWarning: 'hsl(var(--primary))',
      borderRadius: '0.5rem',
      fontFamily: 'inherit',
      fontSize: '14px',
    }
  }}
  routing="hash"
/>
        </div>
      </div>
    </div>
  );
};

export default Profile;
