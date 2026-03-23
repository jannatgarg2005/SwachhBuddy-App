// src/components/WasteChatbot.tsx
import { useState, useRef, useEffect, MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, User, X, Loader2, RefreshCw } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ApiMessage {
  role: "user" | "assistant";
  content: string;
}

const BUBBLE_SIZE      = 56;
const CHATBOX_WIDTH    = 384;
const CHATBOX_HEIGHT   = 520;
const VIEWPORT_PADDING = 24;

const isLocalhost = () =>
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

// ── Comprehensive local fallback ──────────────────────────────────────────────
const buildFallback = (q: string): string => {
  const s = q.toLowerCase().trim();

  if (s.match(/^(hi|hello|hey|namaste|hii|helo|howdy|good morning|good evening|good afternoon|sup)[\s!?.]*$/))
    return "Hello! 👋 I'm EcoBuddy, your AI waste management assistant.\n\nAsk me:\n• 🗑️ Which bin any item belongs in\n• 📱 How to use the app and earn points\n• ♻️ Composting, recycling tips\n• 🤖 Anything else!";

  if (s.match(/plastic bottle|pet bottle|water bottle/))
    return "🔵 **Plastic bottles → Blue (Dry Waste) bin**\n\n• Rinse before disposing — clean plastic is worth more\n• Remove the cap separately\n• PET bottles (code ♳) are India's most recycled plastic ♻️";

  if (s.match(/plastic|dry|recycl/))
    return "🔵 **Dry/Recyclable waste → Blue Bin**\n\n• Paper, cardboard, plastic bottles, glass, metals\n• Keep dry and clean — contamination reduces value\n• Earn +15 pts per verified dry waste disposal on Swachh Buddy!";

  if (s.match(/food|vegetable|fruit|peel|cooked|rice|roti|sabzi|organic/))
    return "🟢 **Food waste → Green (Wet Waste) bin**\n\n• All cooked and uncooked food scraps go here\n• Never mix with dry waste — ruins recyclable value\n• 1 kg food waste makes ~0.3 kg compost in 60 days 🌱";

  if (s.match(/compost|composting/))
    return "🌱 **How to Compost at Home:**\n\n1. Green bin scraps + dry leaves in a covered container\n2. Turn weekly, keep slightly moist\n3. Ready in **45–60 days** — rich fertilizer!\n\nVermicomposting with earthworms is faster (30–45 days) 🪱";

  if (s.match(/phone|mobile|laptop|computer|cable|charger|electronic/))
    return "🟡 **Electronics → Yellow (E-Waste) collection**\n\n• Never in regular bins — toxic metals pollute soil\n• Use Swachh Buddy's E-Waste Day for **+75 pts** ⚡\n• Wipe personal data before disposing!";

  if (s.match(/battery|batteries/))
    return "🟡 **Batteries → Yellow (E-Waste) / Hazardous collection**\n\n• NEVER in regular bins — fire hazard!\n• Lithium (phones): authorised e-waste centres\n• Lead-acid (cars): return to auto shops 🔋";

  if (s.match(/medicine|tablet|capsule|syrup|expired|drug/))
    return "🔴 **Medicines → Pharmacy take-back or Red (Hazardous) bin**\n\n• NEVER flush — pollutes groundwater\n• Return unused medicines to any pharmacy\n• Expired medicines: Red bin or hazardous collection centre 💊";

  if (s.match(/chemical|paint|pesticide|bleach|acid/))
    return "🔴 **Chemicals → Red (Hazardous) bin**\n\n• NEVER pour down drains — contaminates groundwater\n• Keep in original containers with labels\n• Contact municipality for hazardous collection ☣️";

  if (s.match(/which bin|what bin|where.*put|segregat|sort/))
    return "🗑️ **India's 4-Bin System:**\n\n• 🟢 **Green** — Wet/organic (food, peels, garden)\n• 🔵 **Blue** — Dry/recyclable (paper, plastic, glass, metal)\n• 🔴 **Red** — Hazardous (chemicals, medicines, paint)\n• 🟡 **Yellow** — E-Waste (electronics, batteries)";

  if (s.match(/point|earn|reward|coin|redeem/))
    return "🏆 **Earning Points on Swachh Buddy:**\n\n• QR scan: **+25 pts**\n• Report issue: **+50 pts**\n• E-Waste Day: **+75 pts**\n• Training module: **+100 pts**\n\nRedeem in the **Earn** section for rewards!";

  if (s.match(/qr|scan/))
    return "📲 **QR Code Scanning:**\n\nWhen handing waste to the municipal collector, scan their QR code.\n• Earn **+25 points** per verified scan\n• Go to Dashboard → Scan QR Code 🌱";

  if (s.match(/report|issue|missed|pickup|dump/))
    return "📷 **Report Issues:**\n\nSpotted a missed pickup or illegal dumping?\n• Take a photo and submit via Dashboard → Report Issue\n• Earn **+50 points** per verified report 💪";

  if (s.match(/schedule|bulk|furniture|construction/))
    return "📅 **Schedule Pickup:**\n\nBook a bulk waste pickup from home!\n• Dashboard → Schedule Pickup\n• For furniture, e-waste, construction debris\n• 48 hour advance booking 🏠";

  if (s.match(/ewaste|e-waste day|drive|monthly/))
    return "♻️ **E-Waste Day:**\n\nMonthly drives to collect electronics!\n• Drop off phones, laptops, cables, batteries\n• Earn **+75 points** per participation ⚡";

  if (s.match(/map|truck|track|vehicle/))
    return "🗺️ **Live Map:**\n\nSee waste collection vehicles in real-time!\n• Dashboard → Live Map\n• Shows truck location, ETA, and route\n• Also shows illegal dump sites 🚛";

  if (s.match(/learn|train|module|course|certif/))
    return "🎓 **Training Modules:**\n\n• 3 core levels: Basics → Intermediate → Advanced\n• Complete all → earn a **certificate + +100 pts** each\n• Go to the Learn tab 📜";

  if (s.match(/thank|thanks|great|perfect|helpful|awesome/))
    return "You're welcome! 😊\n\nEvery correct waste disposal makes India cleaner. Keep it up! 🇮🇳🌱";

  if (s.match(/who are you|what are you|your name|introduce/))
    return "I'm **EcoBuddy** 🌱 — the AI assistant for Swachh Buddy.\n\nI can tell you which bin any item goes in, guide you through app features, help you earn maximum points, and answer general questions!\n\nAsk me anything!";

  return "I'd love to help! Ask me:\n\n• 🗑️ Which bin any item belongs in\n• 📱 App features — QR scanning, points, map\n• ♻️ Recycling and composting tips\n• 🤖 Any general question!";
};

const WasteChatbot = () => {
  const [isOpen, setIsOpen]             = useState(false);
  const [messages, setMessages]         = useState<Message[]>([{
    id: "1",
    content: "Hello! 👋 I'm **EcoBuddy**, your AI waste management assistant.\n\nAsk me anything about waste disposal, app features, how to earn points — or any general question!",
    sender: "bot",
    timestamp: new Date(),
  }]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading]       = useState(false);
  const scrollRef                       = useRef<HTMLDivElement>(null);
  const [position, setPosition]         = useState({ x: 0, y: 0 });
  const [chatboxPos, setChatboxPos]     = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging]     = useState(false);
  const dragOffset                      = useRef({ x: 0, y: 0 });
  const wasDragged                      = useRef(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [showDot, setShowDot]           = useState(false);

  useEffect(() => {
    setPosition({
      x: window.innerWidth - BUBBLE_SIZE - VIEWPORT_PADDING,
      y: window.innerHeight - BUBBLE_SIZE - VIEWPORT_PADDING,
    });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => { setShowGreeting(true); setShowDot(true); }, 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (showGreeting) {
      const t = setTimeout(() => setShowGreeting(false), 60000);
      return () => clearTimeout(t);
    }
  }, [showGreeting]);

  useEffect(() => {
    if (isOpen) {
      const idealX = position.x - CHATBOX_WIDTH + BUBBLE_SIZE;
      const idealY = position.y - CHATBOX_HEIGHT + BUBBLE_SIZE;
      setChatboxPos({
        x: Math.max(VIEWPORT_PADDING, Math.min(idealX, window.innerWidth - CHATBOX_WIDTH - VIEWPORT_PADDING)),
        y: Math.max(VIEWPORT_PADDING, Math.min(idealY, window.innerHeight - CHATBOX_HEIGHT - VIEWPORT_PADDING)),
      });
    }
  }, [isOpen, position]);

  useEffect(() => {
    const onMove = (e: globalThis.MouseEvent) => {
      wasDragged.current = true;
      setPosition({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
    };
    const onUp = () => {
      setIsDragging(false);
      setTimeout(() => {
        if (!wasDragged.current) {
          setIsOpen(true);
          setShowDot(false);
          setShowGreeting(false);
        }
      }, 0);
    };
    if (isDragging) {
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
      return () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      };
    }
  }, [isDragging]);

  const handleMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    wasDragged.current = false;
    dragOffset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    setIsDragging(true);
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const addBotMessage = (content: string) => {
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      content,
      sender: "bot",
      timestamp: new Date(),
    }]);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const query = inputMessage.trim();
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      content: query,
      sender: "user",
      timestamp: new Date(),
    }]);
    setInputMessage("");
    setIsLoading(true);

    const apiMessages: ApiMessage[] = messages.slice(-8).map(m => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.content,
    }));
    apiMessages.push({ role: "user", content: query });

    try {
      if (isLocalhost()) {
        await new Promise(r => setTimeout(r, 600));
        addBotMessage(buildFallback(query));
        return;
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const responseText = await response.text();

      if (!response.ok) {
        console.error("Chat API error:", response.status, responseText);
        addBotMessage(buildFallback(query));
        return;
      }

      let data: { reply?: string };
      try {
        data = JSON.parse(responseText);
      } catch {
        addBotMessage(buildFallback(query));
        return;
      }

      addBotMessage(data.reply || buildFallback(query));

    } catch {
      addBotMessage(buildFallback(query));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: Date.now().toString(),
      content: "Chat cleared! 🔄 Ask me anything about waste management or any other topic.",
      sender: "bot",
      timestamp: new Date(),
    }]);
  };

  const quickQuestions = [
    "Where does plastic go?",
    "How do I earn points?",
    "How to compost at home?",
    "Which bin for batteries?",
  ];

  const renderContent = (text: string) => ({
    __html: text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br/>"),
  });

  // ── Bubble ───────────────────────────────────────────────────────────────────
  if (!isOpen) return (
    <div className="fixed z-50" style={{ top: position.y, left: position.x }}>
      {showGreeting && (
        <div className="absolute bottom-0 right-full mr-4 w-max max-w-[200px] bg-card text-card-foreground p-3 rounded-lg shadow-lg animate-in fade-in slide-in-from-left-2 duration-500">
          <p className="text-sm font-medium">Hello! 👋</p>
          <p className="text-sm text-muted-foreground">Ask me anything!</p>
          <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-card" />
        </div>
      )}
      <Button
        onMouseDown={handleMouseDown}
        className="relative h-14 w-14 rounded-full shadow-lg p-0 cursor-grab active:cursor-grabbing"
        size="icon"
        variant="ghost"
      >
        {showDot && (
          <span className="absolute top-0 right-0 block h-3.5 w-3.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
        )}
        <img
          src="/chatbot.png"
          alt="EcoBuddy"
          className="h-20 w-20 rounded-full object-cover"
          style={{ pointerEvents: "none" }}
        />
      </Button>
    </div>
  );

  // ── Chat window ──────────────────────────────────────────────────────────────
  return (
    <Card
      className="fixed w-96 shadow-2xl z-50 flex flex-col overflow-hidden rounded-2xl border"
      style={{ top: chatboxPos.y, left: chatboxPos.x, height: CHATBOX_HEIGHT }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-primary/10 to-accent/10 flex-shrink-0">
        <div className="flex items-center gap-2">
          <img src="/chatbot.png" alt="EcoBuddy" className="h-9 w-9 rounded-full" />
          <div>
            <p className="font-bold text-sm leading-tight">EcoBuddy</p>
            <p className="text-xs text-muted-foreground leading-tight">AI Assistant · Ask anything</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={clearChat} className="h-7 w-7" title="Clear chat">
            <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-7 w-7">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            {msg.sender === "bot" && (
              <img src="/chatbot.png" alt="Bot" className="h-7 w-7 rounded-full flex-shrink-0 mt-0.5" />
            )}
            <div className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
              msg.sender === "user"
                ? "bg-primary text-primary-foreground rounded-tr-sm"
                : "bg-muted text-foreground rounded-tl-sm"
            }`}>
              <span dangerouslySetInnerHTML={renderContent(msg.content)} />
              <p className={`text-xs mt-1 ${msg.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            {msg.sender === "user" && (
              <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="h-4 w-4 text-primary" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2 justify-start">
            <img src="/chatbot.png" alt="Bot" className="h-7 w-7 rounded-full flex-shrink-0" />
            <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
              {[0, 150, 300].map(d => (
                <span
                  key={d}
                  className="h-2 w-2 rounded-full bg-primary/60 animate-bounce"
                  style={{ animationDelay: `${d}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick questions — only on first open */}
      {messages.length === 1 && (
        <div className="px-3 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
          {quickQuestions.map((q) => (
            <button
              key={q}
              onClick={() => setInputMessage(q)}
              className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t flex gap-2 items-center bg-background flex-shrink-0">
        <Input
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask anything..."
          className="flex-1 rounded-xl text-sm h-9"
          disabled={isLoading}
        />
        <Button
          onClick={sendMessage}
          disabled={!inputMessage.trim() || isLoading}
          size="icon"
          className="h-9 w-9 rounded-xl flex-shrink-0"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </Card>
  );
};

export default WasteChatbot;