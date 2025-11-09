import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Clock, IndianRupee } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const todaysSpecials = [
    {
      id: "m002",
      name: "Masala Dosa",
      price: 40,
      image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&auto=format&fit=crop",
      badge: "Popular"
    },
    {
      id: "m011",
      name: "Chicken Biryani",
      price: 160,
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop",
      badge: "Chef's Pick"
    },
    {
      id: "m005",
      name: "Sushi Platter",
      price: 220,
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&auto=format&fit=crop",
      badge: "Premium"
    }
  ];

  const internationalCuisines = [
    {
      id: "indian",
      name: "Indian Classics",
      image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop",
      description: "Authentic flavors from across India"
    },
    {
      id: "chinese",
      name: "Chinese Delights",
      image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&auto=format&fit=crop",
      description: "Wok-tossed favorites"
    },
    {
      id: "japanese",
      name: "Japanese Specials",
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&auto=format&fit=crop",
      description: "Fresh sushi and ramen"
    },
    {
      id: "italian",
      name: "Italian Favorites",
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&auto=format&fit=crop",
      description: "Pasta and pizza perfection"
    },
    {
      id: "mexican",
      name: "Mexican Street Food",
      image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop",
      description: "Bold and spicy delights"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % internationalCuisines.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const addToCart = (item: any) => {
    const cart = JSON.parse(sessionStorage.getItem("cartArray") || "[]");
    const existing = cart.find((c: any) => c.id === item.id);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ ...item, qty: 1 });
    }
    sessionStorage.setItem("cartArray", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-secondary to-background py-20 px-4">
        <div className="container mx-auto text-center relative z-10">
          <Badge className="mb-4 px-4 py-1 text-sm" variant="secondary">
            <Sparkles className="h-4 w-4 mr-2" />
            Fresh • Affordable • Global Flavours
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Madras Engineering College
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Canteen Management System
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Order your favorite meals from around the world, skip the queue, and enjoy delicious food on campus
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/menu">
              <Button size="lg" className="text-lg px-8">
                Order Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/offers">
              <Button size="lg" variant="outline" className="text-lg px-8">
                View Offers
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Today's Specials */}
      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Today's Specials</h2>
              <p className="text-muted-foreground">Handpicked by our chefs</p>
            </div>
            <Link to="/menu">
              <Button variant="ghost">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {todaysSpecials.map((item) => (
              <Card key={item.id} className="overflow-hidden group hover:shadow-lg transition-all">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                    {item.badge}
                  </Badge>
                </div>
                <CardContent className="pt-4">
                  <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                  <div className="flex items-center text-lg font-bold text-primary">
                    <IndianRupee className="h-4 w-4" />
                    {item.price}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => addToCart(item)} className="w-full">
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* International Cuisine Slider */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Explore Global Cuisines</h2>
          
          <div className="relative h-96 rounded-xl overflow-hidden">
            {internationalCuisines.map((cuisine, index) => (
              <div
                key={cuisine.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={cuisine.image}
                  alt={cuisine.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
                  <div className="p-8 text-white">
                    <h3 className="text-4xl font-bold mb-2">{cuisine.name}</h3>
                    <p className="text-xl mb-4">{cuisine.description}</p>
                    <Link to="/menu">
                      <Button size="lg" variant="secondary">
                        Explore Menu
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {internationalCuisines.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide ? "bg-white w-8" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary mb-2">50+</div>
                <p className="text-muted-foreground">Menu Items</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary mb-2">1000+</div>
                <p className="text-muted-foreground">Happy Students</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary mb-2">5</div>
                <p className="text-muted-foreground">Cuisines</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary mb-2">15min</div>
                <p className="text-muted-foreground">Avg Pickup</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="py-16 px-4 bg-secondary">
        <div className="container mx-auto">
          <div className="bg-card rounded-xl p-8 border-l-4 border-primary">
            <div className="flex items-start gap-4">
              <Clock className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-4">Latest Announcements</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Digital payment counter now live! Pay seamlessly with UPI, cards, and wallets.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Friday Special: Veg Pulao + Drink Combo at ₹70 - Save ₹20!</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>New AI Chatbot assistant available - Get instant help with your orders!</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
