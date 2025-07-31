import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import TypewriterText from "@/components/TypewriterText";
import Confetti from "react-confetti";

interface Message {
  id: string;
  sender: 'user' | 'bot';
  content: string;
}

const CharacterCreation = () => {
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createCharacterMutation = useMutation({
    mutationFn: async (character) => {
      const response = await apiRequest("POST", "/api/characters", character);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/characters"] });
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        setLocation("/dashboard");
      }, 3000);
      toast({
        title: "Character Created!",
        description: "Your character has been successfully created.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create character. Please try again.",
        variant: "destructive",
      });
    },
  });

  const sendToAgent = async (input: string) => {
  const res = await fetch("http://localhost:5678/webhook/e3f8a0be-d60c-4814-8b59-7395ed4e66ca", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: input })
  });

  const data = await res.json();
  console.log("🧪 Full response from n8n:", data);
  return data.output;
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: currentInput
    };
    setMessages(prev => [...prev, userMessage]);

    setCurrentInput("");

    const botReply = await sendToAgent(userMessage.content);
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      sender: "bot",
      content: botReply || "Sorry, I didn’t understand that."
    };
    setMessages(prev => [...prev, botMessage]);

    if (botReply?.toLowerCase()?.includes("character created")) {
      setTimeout(() => createCharacterMutation.mutate({ name: "Auto Generated" }), 1500);
    }
  };

  useEffect(() => {
    sendToAgent("start").then(reply => {
      setMessages([{ id: "1", sender: "bot", content: reply }]);
    });
  }, []);

  return (
    <>
      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={200} />
      )}

      <div className="fixed inset-0 z-50 bg-gradient-creative dark:bg-gradient-to-br dark:from-gray-900 dark:via-purple-900 dark:to-violet-900">
        <div className="container mx-auto h-full flex flex-col">
          <motion.div className="glass-effect border-b border-white/20" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <Bot className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Character Creator</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Let's build your character together</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setLocation("/")} className="hover:bg-white/30">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-start space-x-3 ${message.sender === 'user' ? 'justify-end' : ''}`}
                >
                  {message.sender === 'bot' && (
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="text-white text-sm" />
                    </div>
                  )}
                  <Card className={`max-w-md ${message.sender === 'user' ? 'bg-purple-500 text-white' : 'glass-effect border-white/20'}`}>
                    <CardContent className="p-4">
                      {message.sender === 'bot' && index === messages.length - 1 && index > 0 ? (
                        <TypewriterText text={message.content} className="text-gray-800 dark:text-white" />
                      ) : (
                        <p className={message.sender === 'user' ? 'text-white' : 'text-gray-800 dark:text-white'}>
                          {message.content}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                  {message.sender === 'user' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-sky-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="text-white text-sm" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <motion.div className="p-6 glass-effect border-t border-white/20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex space-x-3">
              <Input
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your response..."
                className="flex-1 glass-effect border-white/30 bg-white/50 dark:bg-black/20"
                disabled={createCharacterMutation.isPending}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!currentInput.trim() || createCharacterMutation.isPending}
                className="px-6 bg-purple-500 hover:bg-purple-600"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CharacterCreation;
