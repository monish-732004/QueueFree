import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, LogIn, Search, ShoppingCart, CreditCard, QrCode, Star } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      icon: LogIn,
      title: "Sign In",
      description: "Students and vendors log in through their respective portals with college credentials.",
      userType: "Both"
    },
    {
      step: "02",
      icon: Search,
      title: "Browse Stalls",
      description: "Students explore available stalls, view live menus, prices, and preparation times.",
      userType: "Student"
    },
    {
      step: "03",
      icon: ShoppingCart,
      title: "Place Order",
      description: "Select items, choose pickup time slot, and add special instructions if needed.",
      userType: "Student"
    },
    {
      step: "04",
      icon: CreditCard,
      title: "Secure Payment",
      description: "Complete payment through UPI (GPay/PhonePe/Paytm) for a cashless experience.",
      userType: "Student"
    },
    {
      step: "05",
      icon: QrCode,
      title: "Pickup & Scan",
      description: "Show QR code or student ID at the stall for instant order verification and collection.",
      userType: "Student"
    },
    {
      step: "06",
      icon: Star,
      title: "Rate & Review",
      description: "Share feedback to help improve service quality and help other students choose.",
      userType: "Student"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-subtle">
      <div className="container px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            How{" "}
            <span className="gradient-primary bg-clip-text text-transparent">
              QueueFree
            </span>{" "}
            Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Simple, fast, and efficient. Get your favorite meals in just a few taps.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={index} className="relative border-border hover:shadow-soft transition-smooth">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-lg">
                      {step.step}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                      <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full inline-block mt-1">
                        {step.userType}
                      </div>
                    </div>
                  </div>
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {step.description}
                </CardDescription>
              </CardContent>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2">
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button variant="hero" size="lg" className="text-lg px-8">
            Start Ordering Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;