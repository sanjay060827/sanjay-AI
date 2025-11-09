import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Mic, Send, Bot, User, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Message = {
  id: string;
  from: "bot" | "user";
  text: string;
  timestamp: Date;
};

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      from: "bot",
      text: "Hi! I'm CanteenMate, your friendly canteen assistant. Ask me about menu, offers, or your order. Try: 'Show me Chinese dishes' or 'What offers are available?'",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isBotVoiceEnabled, setIsBotVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speakText = (text: string) => {
    if (!isBotVoiceEnabled || !window.speechSynthesis) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const addMessage = (from: "bot" | "user", text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      from,
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    if (from === "bot") {
      speakText(text);
    }
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    const menuItems = JSON.parse(localStorage.getItem("menuItems") || "[]");
    const offers = JSON.parse(localStorage.getItem("offersList") || "[]");

    // Menu queries
    if (input.includes("menu") || input.includes("dishes") || input.includes("food")) {
      if (input.includes("chinese")) {
        const chinese = menuItems.filter((item: any) => item.category === "Chinese");
        return `Here are our Chinese dishes:\n${chinese.map((item: any) => `• ${item.name} - ₹${item.price}`).join("\n")}`;
      }
      if (input.includes("indian")) {
        const indian = menuItems.filter((item: any) => item.category === "Indian");
        return `Here are our Indian dishes:\n${indian.map((item: any) => `• ${item.name} - ₹${item.price}`).join("\n")}`;
      }
      if (input.includes("japanese")) {
        const japanese = menuItems.filter((item: any) => item.category === "Japanese");
        return `Here are our Japanese dishes:\n${japanese.map((item: any) => `• ${item.name} - ₹${item.price}`).join("\n")}`;
      }
      if (input.includes("italian")) {
        const italian = menuItems.filter((item: any) => item.category === "Italian");
        return `Here are our Italian dishes:\n${italian.map((item: any) => `• ${item.name} - ₹${item.price}`).join("\n")}`;
      }
      if (input.includes("mexican")) {
        const mexican = menuItems.filter((item: any) => item.category === "Mexican");
        return `Here are our Mexican dishes:\n${mexican.map((item: any) => `• ${item.name} - ₹${item.price}`).join("\n")}`;
      }
      if (input.includes("snack")) {
        const snacks = menuItems.filter((item: any) => item.category === "Snacks");
        return `Here are our snacks:\n${snacks.map((item: any) => `• ${item.name} - ₹${item.price}`).join("\n")}`;
      }
      if (input.includes("beverage") || input.includes("drink")) {
        const beverages = menuItems.filter((item: any) => item.category === "Beverages");
        return `Here are our beverages:\n${beverages.map((item: any) => `• ${item.name} - ₹${item.price}`).join("\n")}`;
      }
      if (input.includes("dessert")) {
        const desserts = menuItems.filter((item: any) => item.category === "Desserts");
        return `Here are our desserts:\n${desserts.map((item: any) => `• ${item.name} - ₹${item.price}`).join("\n")}`;
      }
      return "We have Indian, Chinese, Japanese, Italian, Mexican cuisines, plus snacks, beverages, and desserts. Which would you like to see?";
    }

    // Offers queries
    if (input.includes("offer") || input.includes("deal") || input.includes("combo") || input.includes("discount")) {
      if (offers.length === 0) {
        return "No active offers at the moment. Check back soon!";
      }
      return `Current offers:\n${offers.map((o: any) => `• ${o.name} (Code: ${o.code}) - ${o.percentage}% off`).join("\n")}`;
    }

    // Order tracking
    if (input.includes("track") || input.includes("order") || input.includes("status")) {
      const student = sessionStorage.getItem("student");
      if (!student) {
        return "Please login to track your orders. Go to Student Portal to login.";
      }
      const orders = JSON.parse(localStorage.getItem("studentOrders") || "[]");
      const studentOrders = orders.filter((o: any) => o.studentId === student);
      if (studentOrders.length === 0) {
        return "You don't have any orders yet. Start ordering from our menu!";
      }
      const latestOrder = studentOrders[studentOrders.length - 1];
      return `Your latest order ${latestOrder.orderID} is ${latestOrder.status}. Pickup time: ${latestOrder.pickupTime}`;
    }

    // Help
    if (input.includes("help") || input.includes("contact")) {
      return "You can:\n• Ask about menu items\n• Check available offers\n• Track your orders\n• Get information about timings\n\nFor urgent issues, visit the Complaints page.";
    }

    // Specific items
    const foundItem = menuItems.find((item: any) => 
      input.includes(item.name.toLowerCase())
    );
    if (foundItem) {
      return `${foundItem.name}: ${foundItem.desc}. Price: ₹${foundItem.price}. ${foundItem.veg ? "Vegetarian" : "Non-vegetarian"}`;
    }

    // Default response
    return "I can help you with:\n• Menu items (try: 'Show Chinese dishes')\n• Available offers\n• Order tracking\n• General information\n\nWhat would you like to know?";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    addMessage("user", input);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getBotResponse(input);
      addMessage("bot", response);
      setIsTyping(false);
    }, 1000);
  };

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast({
        title: "Not Supported",
        description: "Voice input is not supported in your browser",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast({
        title: "Error",
        description: "Could not capture voice input",
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const quickActions = [
    { label: "🍱 Menu", action: "Show me the menu" },
    { label: "🥤 Beverages", action: "Show beverages" },
    { label: "🍟 Snacks", action: "Show snacks" },
    { label: "💸 Offers", action: "What offers are available?" },
    { label: "📦 Track Order", action: "Track my order" },
    { label: "🆘 Help", action: "Help me" },
  ];

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-background via-secondary to-background">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <Card className="mb-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-3xl">
                🍴
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-1">CanteenMate</h1>
                <p className="text-muted-foreground">Your friendly canteen assistant (English)</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsBotVoiceEnabled(!isBotVoiceEnabled)}
                title="Toggle Bot Voice"
              >
                {isBotVoiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="mb-6 h-[500px] flex flex-col">
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.from === "bot" && (
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Bot className="h-5 w-5 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                      message.from === "bot"
                        ? "bg-secondary text-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-line">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  {message.from === "user" && (
                    <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-accent-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                    <Bot className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="bg-secondary rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          <div className="p-4 border-t">
            <div className="flex flex-wrap gap-2 mb-3">
              {quickActions.map((action, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => {
                    setInput(action.action);
                  }}
                >
                  {action.label}
                </Badge>
              ))}
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleVoiceInput}
                className={isListening ? "bg-red-500 text-white" : ""}
              >
                <Mic className="h-5 w-5" />
              </Button>
              <Input
                placeholder="Type your question here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
              />
              <Button onClick={handleSend} size="icon">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
