import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Store, Clock, TrendingUp, Package, BarChart3, Calendar } from "lucide-react";
import StallRegistration from "@/components/StallRegistration";
import ProductManagement from "@/components/ProductManagement";

interface Order {
  id: string;
  total_amount: number;
  status: string;
  pickup_time_slot: string;
  order_token: string;
  created_at: string;
  student_profiles: {
    name: string;
    student_id: string;
  };
  order_items: {
    quantity: number;
    products: {
      name: string;
    };
  }[];
}

interface Stall {
  id: string;
  name: string;
  description: string;
  floor_number: number;
  is_registered: boolean;
  opening_time: string;
  closing_time: string;
  operating_days: string[];
}

interface SalesReport {
  report_date: string;
  total_orders: number;
  total_revenue: number;
}

const StallPortal = () => {
  const [user, setUser] = useState<User | null>(null);
  const [stall, setStall] = useState<Stall | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [salesReports, setSalesReports] = useState<SalesReport[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        navigate("/stall-owner-auth");
        return;
      }
      setUser(user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/stall-owner-auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchStallData();
    }
  }, [user]);

  useEffect(() => {
    if (stall) {
      fetchOrders();
      fetchSalesReports();
    }
  }, [stall]);

  const fetchStallData = async () => {
    try {
      const { data, error } = await supabase
        .from('stalls')
        .select('*')
        .eq('owner_email', user?.email)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setStall(data);
    } catch (error: any) {
      console.error('Error fetching stall:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    if (!stall) return;
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          student_profiles(name, student_id),
          order_items(
            quantity,
            products(name)
          )
        `)
        .eq('stall_id', stall.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive"
      });
    }
  };

  const fetchSalesReports = async () => {
    if (!stall) return;
    
    try {
      const { data, error } = await supabase
        .from('daily_sales_reports')
        .select('*')
        .eq('stall_id', stall.id)
        .order('report_date', { ascending: false })
        .limit(7);

      if (error) throw error;
      setSalesReports(data || []);
    } catch (error: any) {
      console.error('Error fetching sales reports:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'preparing': 'bg-blue-100 text-blue-800',
      'ready': 'bg-green-100 text-green-800',
      'completed': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));

      toast({
        title: "Success",
        description: `Order status updated to ${newStatus}`,
      });

      // Refresh sales reports if order was completed
      if (newStatus === 'completed') {
        fetchSalesReports();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent/5 via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show registration form if stall is not registered
  if (!stall || !stall.is_registered) {
    return (
      <StallRegistration 
        onRegistrationComplete={fetchStallData}
        userEmail={user?.email || ""}
      />
    );
  }

  const todaySales = salesReports.find(report => 
    report.report_date === new Date().toISOString().split('T')[0]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/5 via-background to-primary/5">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-accent">QueueFree Vendor Portal</h1>
            <p className="text-sm text-muted-foreground">{stall.name}</p>
          </div>
          <Button variant="ghost" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todaySales?.total_orders || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orders.filter(order => order.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ready Orders</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orders.filter(order => order.status === 'ready').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{todaySales?.total_revenue || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="sales">Sales Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>Track and manage all incoming orders</CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No orders yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">Order #{order.order_token}</h3>
                            <p className="text-sm text-muted-foreground">
                              Student: {order.student_profiles.name} ({order.student_profiles.student_id})
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Pickup: {new Date(order.pickup_time_slot).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">₹{order.total_amount}</p>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="bg-muted/50 rounded-lg p-3">
                          <h4 className="font-medium mb-2">Items:</h4>
                          <div className="space-y-1">
                            {order.order_items.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{item.products.name}</span>
                                <span>x{item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {order.status === 'pending' && (
                            <Button size="sm" onClick={() => updateOrderStatus(order.id, 'preparing')}>
                              Start Preparing
                            </Button>
                          )}
                          {order.status === 'preparing' && (
                            <Button size="sm" onClick={() => updateOrderStatus(order.id, 'ready')}>
                              Mark Ready
                            </Button>
                          )}
                          {order.status === 'ready' && (
                            <Button size="sm" onClick={() => updateOrderStatus(order.id, 'completed')}>
                              Mark Completed
                            </Button>
                          )}
                          {(order.status === 'pending' || order.status === 'preparing') && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            >
                              Cancel Order
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <ProductManagement stallId={stall.id} />
          </TabsContent>

          {/* Sales Reports Tab */}
          <TabsContent value="sales">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Sales Reports
                </CardTitle>
                <CardDescription>Track your daily sales performance</CardDescription>
              </CardHeader>
              <CardContent>
                {salesReports.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No sales data available yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {salesReports.map((report, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">
                              {new Date(report.report_date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {report.total_orders} orders
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">₹{report.total_revenue}</p>
                          <p className="text-sm text-muted-foreground">
                            ₹{(report.total_revenue / Math.max(report.total_orders, 1)).toFixed(2)} avg
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Stall Settings</CardTitle>
                <CardDescription>Manage your stall information and operating hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Stall Name</p>
                      <p className="text-sm text-muted-foreground">{stall.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Floor</p>
                      <p className="text-sm text-muted-foreground">Floor {stall.floor_number}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Description</p>
                    <p className="text-sm text-muted-foreground">{stall.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Opening Time</p>
                      <p className="text-sm text-muted-foreground">{stall.opening_time}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Closing Time</p>
                      <p className="text-sm text-muted-foreground">{stall.closing_time}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Operating Days</p>
                    <div className="flex gap-2 mt-1">
                      {stall.operating_days?.map(day => (
                        <Badge key={day} variant="outline">{day}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StallPortal;