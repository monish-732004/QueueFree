import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Users, Store } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-8 flex items-center space-x-2">
          <UtensilsCrossed className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
            QueueFree
          </span>
        </div>

        <nav className="flex flex-1 items-center justify-between">
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-foreground hover:text-primary transition-smooth">
              Features
            </a>
            <a href="#how-it-works" className="text-foreground hover:text-primary transition-smooth">
              How It Works
            </a>
            <a href="#contact" className="text-foreground hover:text-primary transition-smooth">
              Contact
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Student Login
            </Button>
            <Button variant="outline" size="sm">
              <Store className="h-4 w-4 mr-2" />
              Vendor Login
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;