// src/pages/Chat.tsx

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useParams } from "wouter";
import { X, Send, Settings, ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import { type Character } from "@shared/schema";
import TypewriterText from "@/components/TypewriterText";
import CharacterSettings from "@/components/CharacterSettings";
import { generateCharacterResponse } from "@/lib/characterResponses";

interface Message {
  id: string;
  sender: 'user' | 'character';
  content: string;
  timestamp: string;
}

const Chat = () => {
  const { id: characterId } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!characterId) return;
    ;(async () => {
      const { data, error } = await supabase
        .from("characters")
        .select("*")
        .eq("id", characterId)
        .single();
      if (!error && data) setCharacter(data);
      else console.error("Supabase error:", error);
      setLoading(false);
    })();
  }, [characterId]);

  useEffect(() => {
    if (character) {
      const greeting: Message = {
        id: "initial",
        sender: "character",
        content: getInitialGreeting(character),
        timestamp: new Date().toISOString(),
      };
      setMessages([greeting]);
    }
  }, [character]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getInitialGreeting = (c: Character) => {
    const greetings: Record<string, string> = {
      "Elven Mage": "Greetings, seeker. The ancient trees have whispered of your arrival...",
      "Space Smuggler": "Well, well, what do we have here? Another soul looking for adventure?",
      "Victorian Detective": "Ah, a visitor to my study. Perhaps a fresh perspective would be illuminating?",
      default: `Hello there! I'm ${c.name || "someone"} — what creative venture shall we explore?`,
    };
    return greetings[c.archetype ?? ""] || greetings.default;
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !character) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateCharacterResponse(character, userMsg.content, messages);
      const charMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "character",
        content: response,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, charMsg]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const quickMessages = [
    "Tell me about yourself",
    "I need creative inspiration",
    "Help me with my story",
    "What would you do in this situation?",
  ];

  if (loading) return <div className="fixed inset-0 ...">Loading character...</div>;
  if (!character) return <div className="fixed inset-0 ...">Character not found.</div>;

  return (
    <>
      <div className="fixed inset-0 ...">
        {/* Chat Container */}
        <div className="container mx-auto h-full flex">
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <motion.div className="glass-effect border-b ..." initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center space-x-3">
                  <img
                    src={character.avatar || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80"} 
                    alt={character.name ?? ""}
                    className="w-12 h-12 rounded-full ..."
                    onError={({ currentTarget }) => currentTarget.src = ""}
                  />
                  <div>
                    <h2 className="text-xl ...">{character.name}</h2>
                    <p className="text-sm ...">Online • {character.archetype ?? ""}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}><Settings className="h-5 w-5" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => setLocation("/dashboard")}><ArrowLeft className="h-5 w-5" /></Button>
                </div>
              </div>
            </motion.div>

            {/* Message List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence>
                {messages.map((msg, idx) => (
                  <motion.div key={msg.id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: idx*0.1 }} className={`flex ... ${msg.sender==="user"?"justify-end":""}`}>
                    {msg.sender === "character" && (
                      <img
                        src={character.avatar || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80"} 
                        alt={character?.name ?? "Character Avatar"}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                    )}
                    <Card className={`max-w-md ${msg.sender==="user"?"bg-purple-500 text-white":"glass-effect border-white/20"}`}>
                      <CardContent className="p-4">
                        {msg.sender==="character" && idx === messages.length-1 && idx>0 ? (
                          <TypewriterText text={msg.content} className="..." />
                        ) : <p className={msg.sender==="user"?"text-white":"text-gray-800 dark:text-white"}>{msg.content}</p>}
                        <span className={`text-xs mt-2 block ${msg.sender==="user"?"text-purple-200":"text-gray-500 dark:text-gray-400"}`}>{new Date(msg.timestamp).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}</span>
                      </CardContent>
                    </Card>
                    {msg.sender==="user" && <div className="w-8 h-8 ..."><User className="text-white text-sm" /></div>}
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping && (
                <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="flex items-start space-x-3">
                  <img src={character.avatar ?? ""} alt="" className="w-8 h-8 rounded-full ..." />
                  <Card className="glass-effect border-white/20">
                    <CardContent className="p-4">
                      <div className="flex space-x-1"><div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay:"0.1s"}}></div><div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay:"0.2s"}}></div></div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <motion.div className="p-6 glass-effect border-t ..." initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
              <div className="flex space-x-3 mb-3">
                <Input value={input} onChange={e=>setInput(e.target.value)} onKeyPress={e=> e.key==="Enter" && handleSendMessage()} placeholder="Ask me anything..." className="flex-1 glass-effect border-white/30 bg-white/50 dark:bg-black/20" disabled={isTyping} />
                <Button onClick={handleSendMessage} disabled={!input.trim() || isTyping} className="px-6 bg-purple-500 hover:bg-purple-600"><Send className="h-4 w-4"/></Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickMessages.map((msg,i)=>(
                  <Button key={i} variant="ghost" size="sm" onClick={()=>setInput(msg)} className="text-xs glass-effect hover:bg-white/30">{msg}</Button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <CharacterSettings character={character!} isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
};

export default Chat;
