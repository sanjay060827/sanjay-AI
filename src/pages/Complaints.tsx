import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Complaint = {
  id: string;
  name: string;
  contact: string;
  category: string;
  description: string;
  status: string;
  date: string;
};

export default function Complaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const student = sessionStorage.getItem("student");
    if (student) {
      const allComplaints = JSON.parse(localStorage.getItem("complaintArray") || "[]");
      const studentComplaints = allComplaints.filter((c: Complaint) => c.contact === student);
      setComplaints(studentComplaints);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const name = formData.get("name") as string;
    const contact = formData.get("contact") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;

    if (!name || !contact || !category || !description) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    const complaintId = "C" + Date.now();
    const newComplaint: Complaint = {
      id: complaintId,
      name,
      contact,
      category,
      description,
      status: "Pending",
      date: new Date().toISOString(),
    };

    const allComplaints = JSON.parse(localStorage.getItem("complaintArray") || "[]");
    allComplaints.push(newComplaint);
    localStorage.setItem("complaintArray", JSON.stringify(allComplaints));

    setComplaints([...complaints, newComplaint]);

    toast({
      title: "Complaint Submitted",
      description: `Your complaint ID is ${complaintId}. We'll get back to you soon.`,
    });

    (e.target as HTMLFormElement).reset();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4" />;
      case "In Progress":
        return <AlertCircle className="h-4 w-4" />;
      case "Resolved":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500";
      case "In Progress":
        return "bg-blue-500";
      case "Resolved":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Complaints & Feedback</h1>
          <p className="text-muted-foreground">
            We value your feedback. Let us know how we can improve.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Submit Complaint Form */}
          <Card>
            <CardHeader>
              <CardTitle>Submit a Complaint</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Your Name *</Label>
                  <Input id="name" name="name" placeholder="John Doe" required />
                </div>

                <div>
                  <Label htmlFor="contact">Contact (Email or Roll Number) *</Label>
                  <Input
                    id="contact"
                    name="contact"
                    placeholder="john@example.com or 2025001"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food-quality">Food Quality</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                      <SelectItem value="cleanliness">Cleanliness</SelectItem>
                      <SelectItem value="pricing">Pricing</SelectItem>
                      <SelectItem value="order-issue">Order Issue</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Please describe your issue in detail..."
                    rows={5}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Submit Complaint
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Complaint History */}
          <Card>
            <CardHeader>
              <CardTitle>Your Complaints</CardTitle>
            </CardHeader>
            <CardContent>
              {complaints.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No complaints submitted yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {complaints.map((complaint) => (
                    <Card key={complaint.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-semibold text-sm text-muted-foreground">
                              {complaint.id}
                            </p>
                            <p className="font-semibold">{complaint.category}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(complaint.date).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={`${getStatusColor(complaint.status)} flex items-center gap-1`}>
                            {getStatusIcon(complaint.status)}
                            {complaint.status}
                          </Badge>
                        </div>
                        <p className="text-sm">{complaint.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need Immediate Assistance?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">📞 Phone</h3>
                <p className="text-muted-foreground">+91 44 1234 5678</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">📧 Email</h3>
                <p className="text-muted-foreground">canteen@madrasengg.ac.in</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🕐 Working Hours</h3>
                <p className="text-muted-foreground">Mon-Sat: 8 AM - 8 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
