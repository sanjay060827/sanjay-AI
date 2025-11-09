import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { IndianRupee, Search, Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  // Indian
  { id: "m001", category: "Indian", name: "Idly", price: 20, veg: true, image: "https://images.unsplash.com/photo-1589301773859-bb024d3dd544?w=400&auto=format&fit=crop", desc: "Soft idly with coconut chutney" },
  { id: "m002", category: "Indian", name: "Masala Dosa", price: 40, veg: true, image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&auto=format&fit=crop", desc: "Crispy dosa with potato masala" },
  { id: "m009", category: "Indian", name: "Paneer Butter Masala", price: 90, veg: true, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&auto=format&fit=crop", desc: "Creamy paneer curry" },
  { id: "m010", category: "Indian", name: "Veg Pulao", price: 70, veg: true, image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&auto=format&fit=crop", desc: "Fragrant vegetable pulao" },
  { id: "m011", category: "Indian", name: "Chicken Biryani", price: 160, veg: false, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop", desc: "Aromatic chicken biryani" },
  
  // Chinese
  { id: "m003", category: "Chinese", name: "Veg Fried Rice", price: 60, veg: true, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&auto=format&fit=crop", desc: "Wok-fried rice with vegetables" },
  { id: "m004", category: "Chinese", name: "Chicken Manchurian", price: 120, veg: false, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&auto=format&fit=crop", desc: "Saucy chicken balls" },
  { id: "m012", category: "Chinese", name: "Hakka Noodles", price: 80, veg: true, image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&auto=format&fit=crop", desc: "Stir-fried noodles" },
  { id: "m013", category: "Chinese", name: "Schezwan Noodles", price: 95, veg: false, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&auto=format&fit=crop", desc: "Spicy noodles" },
  
  // Japanese
  { id: "m005", category: "Japanese", name: "Sushi Platter", price: 220, veg: false, image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&auto=format&fit=crop", desc: "Assorted sushi" },
  { id: "m014", category: "Japanese", name: "Ramen", price: 120, veg: false, image: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400&auto=format&fit=crop", desc: "Rich broth ramen" },
  
  // Italian
  { id: "m006", category: "Italian", name: "Spaghetti Aglio", price: 150, veg: true, image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&auto=format&fit=crop", desc: "Garlic & olive oil spaghetti" },
  { id: "m015", category: "Italian", name: "Margherita Pizza", price: 130, veg: true, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&auto=format&fit=crop", desc: "Classic cheese pizza" },
  { id: "m016", category: "Italian", name: "Penne Arrabbiata", price: 140, veg: true, image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&auto=format&fit=crop", desc: "Spicy tomato penne" },
  
  // Mexican
  { id: "m007", category: "Mexican", name: "Chicken Tacos", price: 130, veg: false, image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&auto=format&fit=crop", desc: "Grilled chicken tacos" },
  { id: "m017", category: "Mexican", name: "Veg Burrito", price: 120, veg: true, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&auto=format&fit=crop", desc: "Rice & beans wrap" },
  
  // Snacks
  { id: "m008", category: "Snacks", name: "Samosa", price: 15, veg: true, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&auto=format&fit=crop", desc: "Crispy potato samosa" },
  { id: "m018", category: "Snacks", name: "French Fries", price: 50, veg: true, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&auto=format&fit=crop", desc: "Crispy fries" },
  { id: "m019", category: "Snacks", name: "Veg Wrap", price: 75, veg: true, image: "https://images.unsplash.com/photo-1626266061368-46a8f578ddd6?w=400&auto=format&fit=crop", desc: "Grilled veg wrap" },
  
  // Beverages
  { id: "b001", category: "Beverages", name: "Cold Coffee", price: 40, veg: true, image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&auto=format&fit=crop", desc: "Iced coffee" },
  { id: "b002", category: "Beverages", name: "Hot Coffee", price: 30, veg: true, image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&auto=format&fit=crop", desc: "Brewed coffee" },
  { id: "b003", category: "Beverages", name: "Masala Chai", price: 15, veg: true, image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop", desc: "Indian spiced tea" },
  { id: "b004", category: "Beverages", name: "Lemonade", price: 25, veg: true, image: "https://images.unsplash.com/photo-1523677011781-c91d1bbe2f0f?w=400&auto=format&fit=crop", desc: "Refreshingly sour-sweet" },
  { id: "b005", category: "Beverages", name: "Cold Drink", price: 35, veg: true, image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&auto=format&fit=crop", desc: "Soft drinks" },
  
  // Desserts
  { id: "d001", category: "Desserts", name: "Gulab Jamun", price: 30, veg: true, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&auto=format&fit=crop", desc: "Syrupy sweet balls" },
  { id: "d002", category: "Desserts", name: "Chocolate Brownie", price: 50, veg: true, image: "https://images.unsplash.com/photo-1606313564778-8c7cd08dfc7d?w=400&auto=format&fit=crop", desc: "Chocolate fudge brownie" },
];

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState(menuItems);
  const { toast } = useToast();

  const categories = ["All", "Indian", "Chinese", "Japanese", "Italian", "Mexican", "Snacks", "Beverages", "Desserts"];

  useEffect(() => {
    localStorage.setItem("menuItems", JSON.stringify(menuItems));
  }, []);

  useEffect(() => {
    let filtered = menuItems;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [selectedCategory, searchQuery]);

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
    
    toast({
      title: "Added to cart!",
      description: `${item.name} has been added to your cart.`,
    });
  };

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
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {item.veg && (
                  <Badge className="absolute top-3 left-3 bg-green-600">
                    <Leaf className="h-3 w-3 mr-1" /> Veg
                  </Badge>
                )}
                <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                  {item.category}
                </Badge>
              </div>
              <CardContent className="pt-4">
                <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{item.desc}</p>
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
