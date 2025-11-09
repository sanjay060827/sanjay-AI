import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, Package, Tag, FileText, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const adminId = formData.get("adminId") as string;
    const password = formData.get("password") as string;

    // Demo admin credentials
    if (adminId === "admin" && password === "admin123") {
      setIsLoggedIn(true);
      loadOrders();
      toast({
        title: "Welcome Admin!",
        description: "Successfully logged in",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  const loadOrders = () => {
    const allOrders = JSON.parse(localStorage.getItem("studentOrders") || "[]");
    setOrders(allOrders);
  };

  const updateOrderStatus = (orderID: string, newStatus: string) => {
    const allOrders = JSON.parse(localStorage.getItem("studentOrders") || "[]");
    const orderIndex = allOrders.findIndex((o: any) => o.orderID === orderID);
    
    if (orderIndex !== -1) {
      allOrders[orderIndex].status = newStatus;
      localStorage.setItem("studentOrders", JSON.stringify(allOrders));
      setOrders(allOrders);
      
      toast({
        title: "Status Updated",
        description: `Order ${orderID} is now ${newStatus}`,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-500";
      case "Paid": return "bg-blue-500";
      case "Preparing": return "bg-orange-500";
      case "Ready": return "bg-green-500";
      case "Completed": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen py-16 px-4">
        <div className="container mx-auto max-w-md">
          <div className="text-center mb-8">
            <ShieldCheck className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold mb-2">Admin Portal</h1>
            <p className="text-muted-foreground">Secure access for administrators only</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Admin Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="adminId">Admin ID</Label>
                  <Input id="adminId" name="adminId" placeholder="admin" required />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" placeholder="admin123" required />
                </div>
                <Button type="submit" className="w-full">Login</Button>
              </form>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Demo credentials: admin / admin123
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={() => setIsLoggedIn(false)}>Logout</Button>
        </div>

        <Tabs defaultValue="orders">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="orders">
              <Package className="h-4 w-4 mr-2" /> Orders
            </TabsTrigger>
            <TabsTrigger value="menu">
              <Tag className="h-4 w-4 mr-2" /> Menu
            </TabsTrigger>
            <TabsTrigger value="students">
              <Users className="h-4 w-4 mr-2" /> Students
            </TabsTrigger>
            <TabsTrigger value="reports">
              <FileText className="h-4 w-4 mr-2" /> Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No orders yet</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.orderID}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-semibold text-lg">{order.orderID}</p>
                              <p className="text-sm text-muted-foreground">Student: {order.studentId}</p>
                              <p className="text-sm text-muted-foreground">
                                Pickup: {order.pickupTime} | Items: {order.cart.length}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                              <p className="text-lg font-bold text-primary mt-2">₹{order.total}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Select onValueChange={(value) => updateOrderStatus(order.orderID, value)}>
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Update Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Preparing">Preparing</SelectItem>
                                <SelectItem value="Ready">Ready for Pickup</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menu">
            <Card>
              <CardHeader>
                <CardTitle>Menu Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Menu management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Student Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Student management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Reports & Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Reports and analytics coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
