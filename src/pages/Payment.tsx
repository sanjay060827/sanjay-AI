import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { IndianRupee, CreditCard, Smartphone, Wallet, Banknote, Award, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRCode from "qrcode";

export default function Payment() {
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [redeemPoints, setRedeemPoints] = useState(0);
  const [qrCode, setQrCode] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const order = JSON.parse(sessionStorage.getItem("currentOrder") || "{}");
    if (!order.orderID) {
      navigate("/cart");
      return;
    }
    setCurrentOrder(order);
  }, [navigate]);

  const handleRedeemPoints = () => {
    const student = sessionStorage.getItem("student");
    if (!student) return;

    const students = JSON.parse(localStorage.getItem("studentsList") || "[]");
    const studentData = students.find((s: any) => s.roll === student);

    if (!studentData) return;

    const availablePoints = studentData.rewards || 0;

    if (redeemPoints > availablePoints) {
      toast({
        title: "Insufficient Points",
        description: `You only have ${availablePoints} points available`,
        variant: "destructive",
      });
      return;
    }

    const discount = redeemPoints;
    const newTotal = Math.max(0, currentOrder.total - discount);

    setCurrentOrder({ ...currentOrder, total: newTotal, redeemedPoints: redeemPoints });

    toast({
      title: "Points Redeemed!",
      description: `${redeemPoints} points applied. Saved ₹${discount}`,
    });
  };

  const handlePayment = async () => {
    if (paymentMethod === "cash") {
      completeOrder("Pending (Cash)");
      return;
    }

    // Simulate online payment
    setTimeout(() => {
      completeOrder("Paid");
    }, 1500);
  };

  const completeOrder = async (status: string) => {
    const updatedOrder = {
      ...currentOrder,
      status: status === "Paid" ? "Preparing" : status,
      paymentMethod,
      paymentDate: new Date().toISOString(),
    };

    // Update orders
    const orders = JSON.parse(localStorage.getItem("studentOrders") || "[]");
    const orderIndex = orders.findIndex((o: any) => o.orderID === currentOrder.orderID);
    if (orderIndex !== -1) {
      orders[orderIndex] = updatedOrder;
      localStorage.setItem("studentOrders", JSON.stringify(orders));
    }

    // Award reward points (1 point per ₹10)
    const pointsEarned = Math.floor(currentOrder.total / 10);
    const student = sessionStorage.getItem("student");
    if (student) {
      const students = JSON.parse(localStorage.getItem("studentsList") || "[]");
      const studentIndex = students.findIndex((s: any) => s.roll === student);
      if (studentIndex !== -1) {
        students[studentIndex].rewards = (students[studentIndex].rewards || 0) + pointsEarned - (currentOrder.redeemedPoints || 0);
        localStorage.setItem("studentsList", JSON.stringify(students));
      }
    }

    // Generate QR code
    const qrData = JSON.stringify({
      orderID: currentOrder.orderID,
      studentId: currentOrder.studentId,
      total: currentOrder.total,
    });
    
    try {
      const qrUrl = await QRCode.toDataURL(qrData);
      setQrCode(qrUrl);
    } catch (err) {
      console.error("QR generation error:", err);
    }

    setIsPaid(true);

    toast({
      title: "Payment Successful!",
      description: `Order ${currentOrder.orderID} confirmed. Earned ${pointsEarned} reward points!`,
    });
  };

  if (!currentOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (isPaid) {
    return (
      <div className="min-h-screen py-16 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <CheckCircle className="h-24 w-24 mx-auto text-green-600 mb-6" />
          <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-xl text-muted-foreground mb-8">Your order has been confirmed</p>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <p className="text-lg font-semibold mb-2">Order ID</p>
              <p className="text-3xl font-bold text-primary mb-6">{currentOrder.orderID}</p>
              
              {qrCode && (
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-4">Show this QR code at pickup</p>
                  <img src={qrCode} alt="Order QR Code" className="mx-auto w-64 h-64" />
                </div>
              )}

              <Separator className="my-6" />

              <div className="text-left space-y-2">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-semibold text-green-600">Preparing</span>
                </div>
                <div className="flex justify-between">
                  <span>Pickup Time:</span>
                  <span className="font-semibold">{currentOrder.pickupTime}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span>Total Paid:</span>
                  <div className="flex items-center font-bold text-primary">
                    <IndianRupee className="h-5 w-5" />
                    {currentOrder.total}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate("/student")} size="lg">
              View Orders
            </Button>
            <Button onClick={() => navigate("/menu")} variant="outline" size="lg">
              Order More
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Complete Payment</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Redeem Points */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Redeem Reward Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="Points to redeem"
                      value={redeemPoints || ""}
                      onChange={(e) => setRedeemPoints(Number(e.target.value))}
                      min="0"
                    />
                  </div>
                  <Button onClick={handleRedeemPoints}>Redeem</Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  1 point = ₹1 discount
                </p>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Select Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-secondary">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Smartphone className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold">UPI</p>
                          <p className="text-sm text-muted-foreground">GPay, PhonePe, Paytm</p>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-secondary">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold">Credit / Debit Card</p>
                          <p className="text-sm text-muted-foreground">Visa, Mastercard, RuPay</p>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-secondary">
                      <RadioGroupItem value="netbanking" id="netbanking" />
                      <Label htmlFor="netbanking" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Wallet className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold">Net Banking</p>
                          <p className="text-sm text-muted-foreground">All major banks</p>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-secondary">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Banknote className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold">Cash on Pickup</p>
                          <p className="text-sm text-muted-foreground">Pay at counter</p>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <div className="flex items-center">
                      <IndianRupee className="h-4 w-4" />
                      {currentOrder.subtotal}
                    </div>
                  </div>

                  {currentOrder.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Offer Discount</span>
                      <div className="flex items-center">
                        - <IndianRupee className="h-4 w-4" />
                        {currentOrder.discount}
                      </div>
                    </div>
                  )}

                  {currentOrder.redeemedPoints > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Points Redeemed</span>
                      <div className="flex items-center">
                        - <IndianRupee className="h-4 w-4" />
                        {currentOrder.redeemedPoints}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (5%)</span>
                    <div className="flex items-center">
                      <IndianRupee className="h-3 w-3" />
                      {currentOrder.tax}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <div className="flex items-center text-primary">
                      <IndianRupee className="h-5 w-5" />
                      {currentOrder.total}
                    </div>
                  </div>
                </div>

                <Button onClick={handlePayment} className="w-full mt-6" size="lg">
                  {paymentMethod === "cash" ? "Confirm Order" : "Pay Now"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
