import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, User, Mail, Key, Hash, Award, Clock, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Student() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [student, setStudent] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const studentId = sessionStorage.getItem("student");
    if (studentId) {
      const students = JSON.parse(localStorage.getItem("studentsList") || "[]");
      const found = students.find((s: any) => s.roll === studentId);
      if (found) {
        setStudent(found);
        setIsLoggedIn(true);
        loadOrders(studentId);
      }
    }
  }, []);

  const loadOrders = (studentId: string) => {
    const allOrders = JSON.parse(localStorage.getItem("studentOrders") || "[]");
    const studentOrders = allOrders.filter((o: any) => o.studentId === studentId);
    setOrders(studentOrders);
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const roll = formData.get("roll") as string;
    const password = formData.get("password") as string;

    if (!roll || !password) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    const students = JSON.parse(localStorage.getItem("studentsList") || "[]");
    const found = students.find((s: any) => s.roll === roll);

    if (!found) {
      toast({
        title: "Login Failed",
        description: "Student not found. Please register first.",
        variant: "destructive",
      });
      return;
    }

    // Simple password check (in production, use proper hashing)
    if (found.password !== btoa(password)) {
      toast({
        title: "Login Failed",
        description: "Incorrect password",
        variant: "destructive",
      });
      return;
    }

    sessionStorage.setItem("student", roll);
    sessionStorage.setItem("role", "student");
    setStudent(found);
    setIsLoggedIn(true);
    loadOrders(roll);

    toast({
      title: "Welcome back!",
      description: `Logged in as ${found.name}`,
    });
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const roll = formData.get("roll") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !roll || !email || !password) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    const students = JSON.parse(localStorage.getItem("studentsList") || "[]");
    
    if (students.some((s: any) => s.roll === roll)) {
      toast({
        title: "Registration Failed",
        description: "Roll number already registered",
        variant: "destructive",
      });
      return;
    }

    if (students.some((s: any) => s.email === email)) {
      toast({
        title: "Registration Failed",
        description: "Email already registered",
        variant: "destructive",
      });
      return;
    }

    const newStudent = {
      name,
      roll,
      email,
      password: btoa(password), // Simple encoding (use proper hashing in production)
      rewards: 0,
      joinedDate: new Date().toISOString(),
    };

    students.push(newStudent);
    localStorage.setItem("studentsList", JSON.stringify(students));

    sessionStorage.setItem("student", roll);
    sessionStorage.setItem("role", "student");
    setStudent(newStudent);
    setIsLoggedIn(true);

    toast({
      title: "Registration Successful!",
      description: "Welcome to MEC Canteen!",
    });
  };

  const handleLogout = () => {
    sessionStorage.removeItem("student");
    sessionStorage.removeItem("role");
    setStudent(null);
    setIsLoggedIn(false);
    setOrders([]);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-500";
      case "Preparing": return "bg-blue-500";
      case "Ready": return "bg-green-500";
      case "Completed": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen py-16 px-4">
        <div className="container mx-auto max-w-md">
          <h1 className="text-4xl font-bold text-center mb-8">Student Portal</h1>

          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login to Your Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="login-roll" className="flex items-center gap-2">
                        <Hash className="h-4 w-4" /> Roll Number
                      </Label>
                      <Input id="login-roll" name="roll" placeholder="e.g., 2025001" required />
                    </div>
                    <div>
                      <Label htmlFor="login-password" className="flex items-center gap-2">
                        <Key className="h-4 w-4" /> Password
                      </Label>
                      <Input id="login-password" name="password" type="password" required />
                    </div>
                    <Button type="submit" className="w-full">Login</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <Label htmlFor="reg-name" className="flex items-center gap-2">
                        <User className="h-4 w-4" /> Full Name
                      </Label>
                      <Input id="reg-name" name="name" placeholder="John Doe" required />
                    </div>
                    <div>
                      <Label htmlFor="reg-roll" className="flex items-center gap-2">
                        <Hash className="h-4 w-4" /> Roll Number
                      </Label>
                      <Input id="reg-roll" name="roll" placeholder="e.g., 2025001" required />
                    </div>
                    <div>
                      <Label htmlFor="reg-email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" /> Email
                      </Label>
                      <Input id="reg-email" name="email" type="email" placeholder="john@example.com" required />
                    </div>
                    <div>
                      <Label htmlFor="reg-password" className="flex items-center gap-2">
                        <Key className="h-4 w-4" /> Password
                      </Label>
                      <Input id="reg-password" name="password" type="password" required />
                    </div>
                    <Button type="submit" className="w-full">Register</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome, {student.name}!</h1>
            <p className="text-muted-foreground">Roll: {student.roll}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Reward Points</p>
                  <p className="text-2xl font-bold">{student.rewards || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <IndianRupee className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">
                    {orders.reduce((sum, o) => sum + o.total, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Orders</CardTitle>
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
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {new Date(order.date).toLocaleString()}
                          </div>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm">{order.cart.length} items</p>
                        <div className="flex items-center font-bold text-primary">
                          <IndianRupee className="h-4 w-4" />
                          {order.total}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
