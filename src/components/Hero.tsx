import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, CreditCard, QrCode } from "lucide-react";
import heroImage from "@/assets/hero-canteen.jpg";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-subtle">
      <div className="container px-4 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Skip the{" "}
                <span className="gradient-primary bg-clip-text text-transparent">
                  Queue
                </span>
                <br />
                Order Smart
              </h1>
              <p className="text-xl text-muted-foreground max-w-[600px]">
                Pre-order your favorite canteen meals and pick them up without waiting. 
                QueueFree makes college dining faster, smarter, and more convenient.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="text-lg px-8">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8">
                Watch Demo
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center space-y-2">
                <Clock className="h-8 w-8 text-primary mx-auto" />
                <p className="text-sm font-medium">Save Time</p>
              </div>
              <div className="text-center space-y-2">
                <CreditCard className="h-8 w-8 text-primary mx-auto" />
                <p className="text-sm font-medium">Easy Payment</p>
              </div>
              <div className="text-center space-y-2">
                <QrCode className="h-8 w-8 text-primary mx-auto" />
                <p className="text-sm font-medium">QR Pickup</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-warm">
              <img
                src={heroImage}
                alt="College canteen with students ordering food"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Floating cards for visual appeal */}
            <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-soft p-4 border">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                <span className="text-sm font-medium">Order Ready!</span>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-soft p-4 border">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-sm font-medium">5 min pickup</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;