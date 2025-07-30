import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useParams } from "wouter";
import { X, Send, Settings, ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type Character, type Conversation } from "@shared/schema";
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
  const params = useParams();
  const [, setLocation] = useLocation();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const characterId = params.id as string;

  const { data: character, isLoading: characterLoading } = useQuery<Character>({
    queryKey: ["/api/characters", characterId],
  });

  const { data: conversation } = useQuery<Conversation>({
    queryKey: ["/api/characters", characterId, "conversation"],
    enabled: !!character,
  });

  const addMessageMutation = useMutation({
    mutationFn: async ({ content, sender }: { content: string; sender: 'user' | 'character' }) => {
      const response = await apiRequest("POST", `/api/characters/${characterId}/messages`, {
        content,
        sender,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/characters", characterId, "conversation"] });
    },
  });

  useEffect(() => {
    if (conversation) {
      setMessages(conversation.messages);
    } else if (character) {
      // Add initial greeting message
      const initialMessage: Message = {
        id: "initial",
        sender: "character",
        content: getInitialGreeting(character),
        timestamp: new Date().toISOString(),
      };
      setMessages([initialMessage]);
    }
  }, [conversation, character]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getInitialGreeting = (character: Character) => {
    const greetings = {
      "Elven Mage": "Greetings, seeker. The ancient trees have whispered of your arrival. What brings you to my sacred grove today?",
      "Space Smuggler": "Well, well, what do we have here? Another soul looking for adventure among the stars? What's the job?",
      "Victorian Detective": "Ah, a visitor to my study. I was just reviewing a most perplexing case. Perhaps a fresh perspective would be illuminating?",
      "default": `Hello there! I'm ${character.name}. I'm here to help with whatever creative challenges you're facing. What's on your mind?`
    };

    return greetings[character.archetype as keyof typeof greetings] || greetings.default;
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !character) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Save user message
    await addMessageMutation.mutateAsync({ content: userMessage.content, sender: "user" });

    // Generate character response
    setTimeout(async () => {
      const response = generateCharacterResponse(character, userMessage.content, messages);
      
      const characterMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "character",
        content: response,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, characterMessage]);
      setIsTyping(false);

      // Save character message
      await addMessageMutation.mutateAsync({ content: characterMessage.content, sender: "character" });
    }, 1000 + Math.random() * 2000);
  };

  const quickMessages = [
    "Tell me about yourself",
    "I need creative inspiration",
    "Help me with my story",
    "What would you do in this situation?",
  ];

  if (characterLoading || !character) {
    return (
      <div className="fixed inset-0 bg-gradient-creative dark:bg-gradient-to-br dark:from-gray-900 dark:via-purple-900 dark:to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading character...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-gradient-creative dark:bg-gradient-to-br dark:from-gray-900 dark:via-purple-900 dark:to-violet-900">
        <div className="container mx-auto h-full flex">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <motion.div 
              className="glass-effect border-b border-white/20"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center space-x-3">
                  <img 
                    src={character.avatar || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60&q=80"} 
                    alt={character.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-purple-500"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                      {character.name}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Online • {character.archetype}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSettings(true)}
                    className="hover:bg-white/30"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setLocation("/dashboard")}
                    className="hover:bg-white/30"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-start space-x-3 ${
                      message.sender === 'user' ? 'justify-end' : ''
                    }`}
                  >
                    {message.sender === 'character' && (
                      <img 
                        src={character.avatar || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80"} 
                        alt={character.name}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                    )}
                    
                    <Card className={`max-w-md ${
                      message.sender === 'user' 
                        ? 'bg-purple-500 text-white' 
                        : 'glass-effect border-white/20'
                    }`}>
                      <CardContent className="p-4">
                        {message.sender === 'character' && index === messages.length - 1 && index > 0 ? (
                          <TypewriterText 
                            text={message.content}
                            className="text-gray-800 dark:text-white"
                          />
                        ) : (
                          <p className={message.sender === 'user' ? 'text-white' : 'text-gray-800 dark:text-white'}>
                            {message.content}
                          </p>
                        )}
                        <span className={`text-xs mt-2 block ${
                          message.sender === 'user' ? 'text-purple-200' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
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

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start space-x-3"
                >
                  <img 
                    src={character.avatar || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80"} 
                    alt={character.name}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <Card className="glass-effect border-white/20">
                    <CardContent className="p-4">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <motion.div 
              className="p-6 glass-effect border-t border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex space-x-3 mb-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything..."
                  className="flex-1 glass-effect border-white/30 bg-white/50 dark:bg-black/20"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isTyping}
                  className="px-6 bg-purple-500 hover:bg-purple-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2">
                {quickMessages.map((message, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => setInput(message)}
                    className="text-xs glass-effect hover:bg-white/30"
                  >
                    {message}
                  </Button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <CharacterSettings
        character={character}
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
};

export default Chat;
