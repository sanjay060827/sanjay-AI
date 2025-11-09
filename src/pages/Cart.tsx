import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { IndianRupee, Trash2, Plus, Minus, ShoppingCart, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Cart() {
  const [cart, setCart] = useState<any[]>([]);
  const [pickupTime, setPickupTime] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadCart = () => {
      const cartData = JSON.parse(sessionStorage.getItem("cartArray") || "[]");
      setCart(cartData);
    };
    loadCart();

    window.addEventListener("cartUpdated", loadCart);
    return () => window.removeEventListener("cartUpdated", loadCart);
  }, []);

  const updateQuantity = (id: string, change: number) => {
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + change);
        return { ...item, qty: newQty };
      }
      return item;
    });
    setCart(updatedCart);
    sessionStorage.setItem("cartArray", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (id: string) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    sessionStorage.setItem("cartArray", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart",
    });
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  };

  const getDiscount = () => {
    const appliedOffer = JSON.parse(sessionStorage.getItem("appliedOffer") || "{}");
    return appliedOffer.discount || 0;
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const discount = getDiscount();
    return Math.floor((subtotal - discount) * 0.05);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = getDiscount();
    const tax = calculateTax();
    return subtotal - discount + tax;
  };

  const confirmOrder = () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before ordering",
        variant: "destructive",
      });
      return;
    }

    if (!pickupTime) {
      toast({
        title: "Pickup time required",
        description: "Please select a pickup time",
        variant: "destructive",
      });
      return;
    }

    const student = sessionStorage.getItem("student");
    if (!student) {
      toast({
        title: "Login required",
        description: "Please login to place an order",
        variant: "destructive",
      });
      navigate("/student");
      return;
    }

    const orderID = "ORD" + Date.now();
    const currentOrder = {
      orderID,
      studentId: student,
      cart: [...cart],
      subtotal: calculateSubtotal(),
      discount: getDiscount(),
      tax: calculateTax(),
      total: calculateTotal(),
      pickupTime,
      specialInstructions,
      status: "Pending",
      date: new Date().toISOString(),
    };

    const orders = JSON.parse(localStorage.getItem("studentOrders") || "[]");
    orders.push(currentOrder);
    localStorage.setItem("studentOrders", JSON.stringify(orders));

    sessionStorage.setItem("currentOrder", JSON.stringify(currentOrder));
    sessionStorage.removeItem("cartArray");
    sessionStorage.removeItem("appliedOffer");

    window.dispatchEvent(new Event("cartUpdated"));

    toast({
      title: "Order confirmed!",
      description: `Your order ID is ${orderID}`,
    });

    navigate("/payment");
  };

  const appliedOffer = JSON.parse(sessionStorage.getItem("appliedOffer") || "{}");

  if (cart.length === 0) {
    return (
      <div className="min-h-screen py-16 px-4">
        <div className="container mx-auto text-center">
          <ShoppingCart className="h-24 w-24 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">Add some delicious items from our menu!</p>
          <Link to="/menu">
            <Button size="lg">Browse Menu</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{item.desc}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center text-lg font-bold text-primary">
                          <IndianRupee className="h-4 w-4" />
                          {item.price}
                        </div>
                        <span className="text-muted-foreground">× {item.qty}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-semibold">{item.qty}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Order Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Order Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="pickupTime" className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4" />
                      Pickup Time *
                    </Label>
                    <Input
                      id="pickupTime"
                      type="time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="specialInstructions" className="mb-2 block">
                      Special Instructions (Optional)
                    </Label>
                    <Textarea
                      id="specialInstructions"
                      placeholder="Any special requests? (e.g., extra spicy, no onions)"
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Order Summary</h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <div className="flex items-center font-semibold">
                      <IndianRupee className="h-4 w-4" />
                      {calculateSubtotal()}
                    </div>
                  </div>

                  {appliedOffer.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedOffer.code})</span>
                      <div className="flex items-center font-semibold">
                        - <IndianRupee className="h-4 w-4" />
                        {appliedOffer.discount}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (5%)</span>
                    <div className="flex items-center">
                      <IndianRupee className="h-3 w-3" />
                      {calculateTax()}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <div className="flex items-center text-primary">
                      <IndianRupee className="h-5 w-5" />
                      {calculateTotal()}
                    </div>
                  </div>
                </div>

                <Button onClick={confirmOrder} className="w-full mt-6" size="lg">
                  Proceed to Payment
                </Button>

                <Link to="/offers" className="block mt-3">
                  <Button variant="outline" className="w-full">
                    Apply Offer Code
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
