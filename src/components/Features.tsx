import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Clock, 
  Smartphone, 
  CreditCard, 
  QrCode, 
  Users, 
  BarChart3,
  UtensilsCrossed,
  Calendar,
  Star
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Clock,
      title: "Time Slot Booking",
      description: "Choose your preferred pickup time and avoid long queues during peak hours.",
      color: "text-primary"
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Intuitive mobile app designed for quick ordering on the go between classes.",
      color: "text-secondary"
    },
    {
      icon: CreditCard,
      title: "UPI Payments",
      description: "Secure payments through GPay, PhonePe, and Paytm. No cash, no hassles.",
      color: "text-primary"
    },
    {
      icon: QrCode,
      title: "QR Code Pickup",
      description: "Show your QR code or student ID for instant order verification and pickup.",
      color: "text-secondary"
    },
    {
      icon: UtensilsCrossed,
      title: "Multiple Stalls",
      description: "Browse menus from all canteen stalls in one place. More variety, more choice.",
      color: "text-primary"
    },
    {
      icon: Calendar,
      title: "Real-time Updates",
      description: "Live menu availability, preparation status, and pickup notifications.",
      color: "text-secondary"
    },
    {
      icon: Users,
      title: "Student Portal",
      description: "Personalized dashboard with order history, favorites, and quick reorders.",
      color: "text-primary"
    },
    {
      icon: BarChart3,
      title: "Vendor Analytics",
      description: "Stall owners get insights on popular items, peak hours, and revenue tracking.",
      color: "text-secondary"
    },
    {
      icon: Star,
      title: "Reviews & Ratings",
      description: "Rate your meals and help fellow students discover the best food options.",
      color: "text-primary"
    }
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Everything you need for
            <span className="gradient-primary bg-clip-text text-transparent"> smart dining</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            QueueFree brings together students, stall owners, and technology to create 
            the ultimate college dining experience.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border-border hover:shadow-soft transition-smooth">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;