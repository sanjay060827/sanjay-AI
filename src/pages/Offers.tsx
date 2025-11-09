import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { IndianRupee, Tag, Calendar, Percent } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useActiveOffers } from "@/hooks/use-database";
import { Offer } from "@/lib/supabase";

// Fallback offers if database is not set up
const fallbackOffers: Offer[] = [
  {
    id: "o001",
    title: "Weekend Special",
    description: "Get 20% off on all orders this weekend!",
    discount_percentage: 20,
    valid_from: new Date().toISOString(),
    valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    active: true,
    created_at: new Date().toISOString()
  },
  {
    id: "o002",
    title: "Student Discount",
    description: "Special 15% discount for students",
    discount_percentage: 15,
    valid_from: new Date().toISOString(),
    valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    active: true,
    created_at: new Date().toISOString()
  }
];

export default function Offers() {
  const [offerCode, setOfferCode] = useState("");
  const { toast } = useToast();
  
  // Fetch active offers from database (fallback to local data if not available)
  const { data: dbOffers, isLoading } = useActiveOffers();
  const offersList = dbOffers || fallbackOffers;

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

    if (!offersList) return;

    const found = offersList.find((o) => o.title.toUpperCase().includes(code));

    if (!found) {
      toast({
        title: "Invalid Code",
        description: "The offer code you entered is not valid",
        variant: "destructive",
      });
      return;
    }

    const now = new Date();
    if (new Date(found.valid_from) > now) {
      toast({
        title: "Not Active",
        description: "This offer is not active yet",
        variant: "destructive",
      });
      return;
    }

    if (new Date(found.valid_until) < now) {
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
    if (found.discount_percentage) {
      discount = Math.floor((subtotal * found.discount_percentage) / 100);
    }

    const newTotal = subtotal - discount;
    sessionStorage.setItem("appliedOffer", JSON.stringify({ code: found.title, discount, newTotal, percentage: found.discount_percentage }));

    toast({
      title: "Offer Applied!",
      description: `You saved ₹${discount} with ${found.title}`,
    });
  };

  const addComboToCart = (combo: Offer) => {
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
      description: `${combo.title} has been added to your cart.`,
    });
  };

  // Show loading only if we're fetching and don't have fallback data
  if (isLoading && !offersList.length) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading offers...</p>
        </div>
      </div>
    );
  }

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
                placeholder="Enter offer code"
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
          {offersList.length > 0 ? (
            offersList.map((combo) => (
            <Card key={combo.id} className="overflow-hidden group hover:shadow-lg transition-all">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&auto=format&fit=crop"
                  alt={combo.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <Badge className="absolute top-3 right-3 bg-green-600 text-white">
                  <Percent className="h-3 w-3 mr-1" />
                  {combo.discount_percentage}% OFF
                </Badge>
              </div>

              <CardContent className="pt-4">
                <h3 className="text-xl font-semibold mb-2">{combo.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{combo.description}</p>

                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-muted-foreground">
                    Save {combo.discount_percentage}%
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Valid till {new Date(combo.valid_until).toLocaleDateString()}
                </div>
              </CardContent>

              <CardFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setOfferCode(combo.title);
                    navigator.clipboard.writeText(combo.title);
                    toast({
                      title: "Code Copied!",
                      description: `${combo.title} copied to clipboard`,
                    });
                  }}
                  className="flex-1"
                >
                  Copy Code
                </Button>
              </CardFooter>
            </Card>
          ))
          ) : (
            <div className="col-span-full text-center py-16">
              <p className="text-xl text-muted-foreground">No active offers available at the moment</p>
            </div>
          )}
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
