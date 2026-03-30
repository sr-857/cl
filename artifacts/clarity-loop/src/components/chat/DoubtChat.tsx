import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
}

export function DoubtChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'bot', content: "Hi! I'm your Clarity Loop AI tutor. What concept can I help you understand today?" }
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Listen for external events to open chat and prefill query
  useEffect(() => {
    const handleOpenChat = (e: Event) => {
      const customEvent = e as CustomEvent<{ query: string }>;
      setIsOpen(true);
      if (customEvent.detail?.query) {
        setInput(`Explain this: "${customEvent.detail.query}"`);
      }
    };

    window.addEventListener('open-chat', handleOpenChat);
    return () => window.removeEventListener('open-chat', handleOpenChat);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: userMsg }]);
    setInput("");

    // Simulate AI response based on keywords
    setTimeout(() => {
      let response = "That's a great question! Based on what we're learning, it connects deeply with the core principles. Could you specify which part is confusing?";
      const lowerQuery = userMsg.toLowerCase();
      
      if (lowerQuery.includes("velocity")) response = "Velocity is speed with a specific direction. It's a vector quantity! So 60km/h is speed, but 60km/h North is velocity.";
      else if (lowerQuery.includes("acceleration")) response = "Acceleration is how fast velocity changes. If you speed up, slow down, or change direction, you are accelerating!";
      else if (lowerQuery.includes("force")) response = "Force = mass × acceleration (Newton's second law). It's a push or pull that can cause an object to accelerate.";
      else if (lowerQuery.includes("energy") || lowerQuery.includes("potential")) response = "Energy is the capacity to do work. Potential energy is stored energy (like a roller coaster at the top), while kinetic energy is energy of motion.";
      else if (lowerQuery.includes("atom")) response = "Atoms are the basic units of matter! They have a nucleus (protons & neutrons) and electrons orbiting around it.";
      else if (lowerQuery.includes("photosynthesis")) response = "Photosynthesis is how plants make food using sunlight, water, and CO2 to create glucose and oxygen.";

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'bot', content: response }]);
    }, 600);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="icon"
              className="h-14 w-14 rounded-full shadow-2xl shadow-primary/40 bg-gradient-to-tr from-primary to-secondary hover:shadow-primary/50 hover:scale-105 transition-all"
            >
              <MessageCircle className="h-6 w-6 text-white" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[350px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-6rem)] bg-card rounded-2xl shadow-2xl border border-border/50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-secondary p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <span className="font-semibold">AI Tutor</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 rounded-full h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10" ref={scrollRef}>
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'bot' && (
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div className={`px-4 py-2.5 rounded-2xl max-w-[80%] text-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                      : 'bg-card border border-border/50 text-card-foreground rounded-tl-sm shadow-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-3 border-t bg-card">
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <Input 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="rounded-full bg-muted/50 border-transparent focus-visible:ring-primary/50 focus-visible:border-primary/50"
                />
                <Button type="submit" size="icon" disabled={!input.trim()} className="rounded-full shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
