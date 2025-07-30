import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Store, Clock, MapPin } from "lucide-react";

interface StallRegistrationProps {
  onRegistrationComplete: () => void;
  userEmail: string;
}

const StallRegistration = ({ onRegistrationComplete, userEmail }: StallRegistrationProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    floor_number: "",
    owner_phone: "",
    opening_time: "",
    closing_time: "",
    operating_days: [] as string[]
  });
  const [loading, setLoading] = useState(false);

  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      operating_days: prev.operating_days.includes(day)
        ? prev.operating_days.filter(d => d !== day)
        : [...prev.operating_days, day]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('stalls')
        .insert({
          name: formData.name,
          description: formData.description,
          floor_number: parseInt(formData.floor_number),
          owner_email: userEmail,
          owner_phone: formData.owner_phone,
          opening_time: formData.opening_time,
          closing_time: formData.closing_time,
          operating_days: formData.operating_days,
          is_registered: true,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your stall has been registered successfully!",
      });

      onRegistrationComplete();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to register stall",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/5 via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
              <Store className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Register Your Stall</CardTitle>
          <CardDescription>
            Complete your stall registration to start accepting orders
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Store className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Stall Information</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Stall Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Rajesh's Fast Food"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.owner_phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, owner_phone: e.target.value }))}
                    placeholder="9876543210"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your stall and cuisine type..."
                  className="min-h-20"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Location</h3>
              </div>
              
              <div>
                <Label htmlFor="floor">Floor Number</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, floor_number: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select floor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Ground Floor</SelectItem>
                    <SelectItem value="2">First Floor</SelectItem>
                    <SelectItem value="3">Second Floor</SelectItem>
                    <SelectItem value="4">Third Floor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Operating Hours</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="opening_time">Opening Time</Label>
                  <Input
                    id="opening_time"
                    type="time"
                    value={formData.opening_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, opening_time: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="closing_time">Closing Time</Label>
                  <Input
                    id="closing_time"
                    type="time"
                    value={formData.closing_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, closing_time: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label>Operating Days</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={day}
                        checked={formData.operating_days.includes(day)}
                        onCheckedChange={() => handleDayToggle(day)}
                      />
                      <Label htmlFor={day} className="text-sm">{day.slice(0, 3)}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registering..." : "Register Stall"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StallRegistration;