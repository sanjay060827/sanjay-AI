import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { IndianRupee, Tag, Calendar, Percent } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const offersList = [
  {
    id: "c001",
    code: "VEGSTART",
    name: "Veg Breakfast Combo",
    price: 80,
    items: "Idly + Vada + Cold Coffee",
    percentage: 10,
    validFrom: "2025-11-01",
    validTo: "2025-12-31",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&auto=format&fit=crop"
  },
  {
    id: "c002",
    code: "CHICKDEAL",
    name: "Chicken Combo",
    price: 120,
    items: "Chicken Roll + Fries + Drink",
    percentage: 15,
    validFrom: "2025-11-01",
    validTo: "2025-12-31",
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&auto=format&fit=crop"
  },
  {
    id: "c003",
    code: "SNACKS50",
    name: "Snack Saver",
    price: 60,
    items: "Samosa + Tea + Biscuit",
    percentage: 20,
    validFrom: "2025-11-01",
    validTo: "2025-12-31",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&auto=format&fit=crop"
  },
  {
    id: "c004",
    code: "BIRYANI25",
    name: "Biryani Bonanza",
    price: 180,
    items: "Chicken Biryani + Raita + Gulab Jamun",
    percentage: 25,
    validFrom: "2025-11-01",
    validTo: "2025-12-31",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop"
  }
];

export default function Offers() {
  const [offerCode, setOfferCode] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem("offersList", JSON.stringify(offersList));
  }, []);

  const applyOffer = () => {
    const code = offerCode.trim().toUpperCase();
    if (!code) {
      toast({
        title: "Error",
        description: "Please enter an offer code",
        variant: "destructive",
      });
      return;
    }

    const offers = JSON.parse(localStorage.getItem("offersList") || "[]");
    const found = offers.find((o: any) => o.code && o.code.toUpperCase() === code);

    if (!found) {
      toast({
        title: "Invalid Code",
        description: "The offer code you entered is not valid",
        variant: "destructive",
      });
      return;
    }

    const now = new Date();
    if (found.validFrom && new Date(found.validFrom) > now) {
      toast({
        title: "Not Active",
        description: "This offer is not active yet",
        variant: "destructive",
      });
      return;
    }

    if (found.validTo && new Date(found.validTo) < now) {
      toast({
        title: "Expired",
        description: "This offer has expired",
        variant: "destructive",
      });
      return;
    }

    const cart = JSON.parse(sessionStorage.getItem("cartArray") || "[]");
    const subtotal = cart.reduce((s: number, i: any) => s + i.price * i.qty, 0);

    let discount = 0;
    if (found.percentage) {
      discount = Math.floor((subtotal * found.percentage) / 100);
    }

    const newTotal = subtotal - discount;
    sessionStorage.setItem("appliedOffer", JSON.stringify({ code: found.code, discount, newTotal, percentage: found.percentage }));

    toast({
      title: "Offer Applied!",
      description: `You saved ₹${discount} with ${found.name}`,
    });
  };

  const addComboToCart = (combo: any) => {
    const cart = JSON.parse(sessionStorage.getItem("cartArray") || "[]");
    const existing = cart.find((c: any) => c.id === combo.id);

    if (existing) {
      existing.qty++;
    } else {
      cart.push({ ...combo, qty: 1 });
    }

    sessionStorage.setItem("cartArray", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

    toast({
      title: "Added to cart!",
      description: `${combo.name} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Offers & Combo Deals</h1>
          <p className="text-muted-foreground">Save more with our exciting combo deals!</p>
        </div>

        {/* Apply Offer Section */}
        <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Have a Promo Code?</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Enter your offer code below to apply discounts to your cart
            </p>
            <div className="flex gap-2 max-w-md">
              <Input
                placeholder="Enter offer code (e.g., VEGSTART)"
                value={offerCode}
                onChange={(e) => setOfferCode(e.target.value)}
                className="uppercase"
              />
              <Button onClick={applyOffer}>Apply</Button>
            </div>
          </CardContent>
        </Card>

        {/* Combo Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offersList.map((combo) => (
            <Card key={combo.id} className="overflow-hidden group hover:shadow-lg transition-all">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={combo.image}
                  alt={combo.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <Badge className="absolute top-3 right-3 bg-green-600 text-white">
                  <Percent className="h-3 w-3 mr-1" />
                  {combo.percentage}% OFF
                </Badge>
              </div>

              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="font-mono">
                    {combo.code}
                  </Badge>
                </div>
                <h3 className="text-xl font-semibold mb-2">{combo.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{combo.items}</p>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-2xl font-bold text-primary">
                    <IndianRupee className="h-5 w-5" />
                    {combo.price}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Save {combo.percentage}%
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Valid till {new Date(combo.validTo).toLocaleDateString()}
                </div>
              </CardContent>

              <CardFooter className="gap-2">
                <Button onClick={() => addComboToCart(combo)} className="flex-1">
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setOfferCode(combo.code);
                    navigator.clipboard.writeText(combo.code);
                    toast({
                      title: "Code Copied!",
                      description: `${combo.code} copied to clipboard`,
                    });
                  }}
                >
                  Copy Code
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* How to Use Section */}
        <Card className="mt-8 bg-secondary">
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold mb-4">How to Use Offers</h3>
            <ol className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary">1.</span>
                <span>Browse our combo deals and find one you like</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary">2.</span>
                <span>Copy the offer code or add the combo directly to your cart</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary">3.</span>
                <span>Enter the code in the "Apply Offer" section or during checkout</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary">4.</span>
                <span>Watch your savings grow and enjoy delicious food at great prices!</span>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
