import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { IndianRupee, Search, Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMenuItems } from "@/hooks/use-database";
import { MenuItem } from "@/lib/supabase";

// Fallback data if database is not set up
const fallbackMenuItems: MenuItem[] = [
  { id: "m001", category: "Indian", name: "Idly", price: 20, description: "Soft idly with coconut chutney", image_url: "https://images.unsplash.com/photo-1589301773859-bb024d3dd544?w=400&auto=format&fit=crop", available: true, created_at: new Date().toISOString() },
  { id: "m002", category: "Indian", name: "Masala Dosa", price: 40, description: "Crispy dosa with potato masala", image_url: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&auto=format&fit=crop", available: true, created_at: new Date().toISOString() },
  { id: "m003", category: "Chinese", name: "Veg Fried Rice", price: 60, description: "Wok-fried rice with vegetables", image_url: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&auto=format&fit=crop", available: true, created_at: new Date().toISOString() },
  { id: "m004", category: "Chinese", name: "Chicken Manchurian", price: 120, description: "Saucy chicken balls", image_url: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&auto=format&fit=crop", available: true, created_at: new Date().toISOString() },
  { id: "m005", category: "Japanese", name: "Sushi Platter", price: 220, description: "Assorted sushi", image_url: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&auto=format&fit=crop", available: true, created_at: new Date().toISOString() },
  { id: "m006", category: "Italian", name: "Spaghetti Aglio", price: 150, description: "Garlic & olive oil spaghetti", image_url: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&auto=format&fit=crop", available: true, created_at: new Date().toISOString() },
  { id: "m007", category: "Mexican", name: "Chicken Tacos", price: 130, description: "Grilled chicken tacos", image_url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&auto=format&fit=crop", available: true, created_at: new Date().toISOString() },
  { id: "m008", category: "Snacks", name: "Samosa", price: 15, description: "Crispy potato samosa", image_url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&auto=format&fit=crop", available: true, created_at: new Date().toISOString() },
  { id: "b001", category: "Beverages", name: "Cold Coffee", price: 40, description: "Iced coffee", image_url: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&auto=format&fit=crop", available: true, created_at: new Date().toISOString() },
  { id: "d001", category: "Desserts", name: "Chocolate Brownie", price: 50, description: "Chocolate fudge brownie", image_url: "https://images.unsplash.com/photo-1606313564778-8c7cd08dfc7d?w=400&auto=format&fit=crop", available: true, created_at: new Date().toISOString() },
];

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const { toast } = useToast();
  
  // Fetch menu items from database (fallback to local data if not available)
  const { data: dbMenuItems, isLoading } = useMenuItems();
  const menuItems = dbMenuItems || fallbackMenuItems;

  // Get unique categories from menu items
  const categories = ["All", ...Array.from(new Set(menuItems.map((item: MenuItem) => item.category)))] as string[];

  useEffect(() => {
    if (!menuItems) return;
    
    let filtered = menuItems;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
      );
    }

    setFilteredItems(filtered);
  }, [selectedCategory, searchQuery, menuItems]);

  const addToCart = (item: MenuItem) => {
    const cart = JSON.parse(sessionStorage.getItem("cartArray") || "[]");
    const existing = cart.find((c: any) => c.id === item.id);
    
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ ...item, qty: 1 });
    }
    
    sessionStorage.setItem("cartArray", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    
    toast({
      title: "Added to cart!",
      description: `${item.name} has been added to your cart.`,
    });
  };

  // Show loading only if we're fetching and don't have fallback data
  if (isLoading && !menuItems.length) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Our Menu</h1>
          <p className="text-muted-foreground">Explore our diverse range of cuisines</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search dishes e.g., Sushi or Dosa"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden group hover:shadow-lg transition-all">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop"}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                  {item.category}
                </Badge>
              </div>
              <CardContent className="pt-4">
                <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                <div className="flex items-center text-xl font-bold text-primary">
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

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No items found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
