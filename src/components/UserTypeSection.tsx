import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Store, ShieldCheck } from "lucide-react";

const UserTypeSection = () => {
  const userTypes = [
    {
      icon: Users,
      title: "Students",
      description: "Pre-order meals, skip queues, and enjoy hassle-free dining between classes.",
      features: [
        "Browse multiple stall menus",
        "Choose pickup time slots", 
        "UPI payment integration",
        "Order history & favorites",
        "QR code pickup"
      ],
      buttonText: "Student Portal",
      buttonVariant: "student" as const,
      gradient: "from-primary to-primary-glow"
    },
    {
      icon: Store,
      title: "Stall Owners",
      description: "Manage your menu, track orders, and grow your business with data insights.",
      features: [
        "Real-time order management",
        "Menu & pricing control",
        "Sales analytics & reports",
        "Customer feedback system",
        "Inventory tracking"
      ],
      buttonText: "Vendor Dashboard",
      buttonVariant: "vendor" as const,
      gradient: "from-secondary to-secondary-light"
    },
    {
      icon: ShieldCheck,
      title: "Admin Panel",
      description: "Oversee the entire system, manage users, and monitor platform performance.",
      features: [
        "User management system",
        "Stall approval process",
        "Platform analytics",
        "Payment monitoring",
        "System configuration"
      ],
      buttonText: "Admin Access",
      buttonVariant: "outline" as const,
      gradient: "from-muted-foreground to-foreground"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Choose Your{" "}
            <span className="gradient-primary bg-clip-text text-transparent">
              Portal
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Different experiences tailored for students, vendors, and administrators.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {userTypes.map((userType, index) => (
            <Card key={index} className="relative overflow-hidden border-border hover:shadow-soft transition-smooth group">
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${userType.gradient} opacity-5 group-hover:opacity-10 transition-smooth`}></div>
              
              <CardHeader className="relative">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${userType.gradient} flex items-center justify-center`}>
                    <userType.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{userType.title}</CardTitle>
                </div>
                <CardDescription className="text-muted-foreground">
                  {userType.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative space-y-6">
                <ul className="space-y-3">
                  {userType.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant={userType.buttonVariant} 
                  className="w-full"
                  onClick={() => {
                    if (userType.title === "Students") {
                      window.location.href = '/student-auth';
                    } else if (userType.title === "Stall Owners") {
                      window.location.href = '/stall-owner-auth';
                    }
                  }}
                >
                  {userType.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserTypeSection;