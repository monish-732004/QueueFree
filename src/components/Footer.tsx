import { UtensilsCrossed, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t">
      <div className="container px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <UtensilsCrossed className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                QueueFree
              </span>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs">
              Revolutionizing college dining with smart pre-ordering and queue-free pickup.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-primary transition-smooth">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-primary transition-smooth">How It Works</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Student Portal</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Vendor Dashboard</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-smooth">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Contact Support</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact Info</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>support@queuefree.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span> monish@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>College Campus, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 QueueFree. All rights reserved with monish. | For SRM STUDENTS Exclusively available </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;