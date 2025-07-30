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
import { type InsertCharacter } from "@shared/schema";
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
  const [currentStep, setCurrentStep] = useState(0);
  const [characterData, setCharacterData] = useState<Partial<InsertCharacter>>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const questions = [
    "Hi there! I'm excited to help you create a new character. Let's start with the basics - what's your character's name?",
    "Great name! Now, can you describe their personality? Are they wise, mysterious, adventurous, analytical, or something else?",
    "Interesting! Where are they from? What's their background or origin story?",
    "What are their main goals or motivations? What drives them?",
    "What are they most afraid of, or what's their biggest challenge?",
    "Tell me about their backstory - what shaped them into who they are today?",
    "What archetype would you say they fit? (e.g., Wise Mentor, Rogue Hero, Detective, Mage, etc.)"
  ];

  const createCharacterMutation = useMutation({
    mutationFn: async (character: InsertCharacter) => {
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

  useEffect(() => {
    // Add initial message
    setMessages([{
      id: "1",
      sender: "bot",
      content: questions[0]
    }]);
  }, []);

  const generatePersonalityTraits = (personality: string) => {
    const traits = {
      wisdom: 50,
      mystery: 50,
      kindness: 50,
      charisma: 50,
      adventure: 50,
      analytical: 50,
    };

    const personalityLower = personality.toLowerCase();
    
    if (personalityLower.includes('wise')) traits.wisdom = 85;
    if (personalityLower.includes('mysterious')) traits.mystery = 80;
    if (personalityLower.includes('kind')) traits.kindness = 85;
    if (personalityLower.includes('charismatic')) traits.charisma = 80;
    if (personalityLower.includes('adventurous')) traits.adventure = 85;
    if (personalityLower.includes('analytical')) traits.analytical = 80;

    return traits;
  };

  const generateTasteProfile = (personality: string, archetype: string) => {
    const profile = {
      music: [] as string[],
      books: [] as string[],
      movies: [] as string[],
    };

    const personalityLower = personality.toLowerCase();
    const archetypeLower = archetype.toLowerCase();

    // Music preferences based on personality
    if (personalityLower.includes('wise') || archetypeLower.includes('mage')) {
      profile.music.push('Classical', 'Ambient', 'Celtic');
    }
    if (personalityLower.includes('adventurous') || archetypeLower.includes('rogue')) {
      profile.music.push('Rock', 'Folk', 'World Music');
    }
    if (personalityLower.includes('mysterious') || archetypeLower.includes('detective')) {
      profile.music.push('Jazz', 'Electronic', 'Noir Soundtracks');
    }

    // Book preferences
    if (archetypeLower.includes('mage') || personalityLower.includes('wise')) {
      profile.books.push('Fantasy', 'Philosophy', 'Mythology');
    }
    if (archetypeLower.includes('detective') || personalityLower.includes('analytical')) {
      profile.books.push('Mystery', 'Crime', 'Science Fiction');
    }
    if (personalityLower.includes('adventurous')) {
      profile.books.push('Adventure', 'Travel', 'Biography');
    }

    // Movie preferences
    if (personalityLower.includes('adventurous')) {
      profile.movies.push('Action', 'Adventure', 'Epic');
    }
    if (personalityLower.includes('mysterious')) {
      profile.movies.push('Thriller', 'Mystery', 'Film Noir');
    }
    if (personalityLower.includes('wise')) {
      profile.movies.push('Drama', 'Historical', 'Documentary');
    }

    return profile;
  };

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: currentInput
    };

    setMessages(prev => [...prev, userMessage]);

    // Store the character data based on current step
    const stepMapping = ['name', 'personality', 'origin', 'goals', 'fears', 'backstory', 'archetype'];
    const currentField = stepMapping[currentStep];
    
    setCharacterData(prev => ({
      ...prev,
      [currentField]: currentInput
    }));

    setCurrentInput("");

    // Move to next step or finish
    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          content: questions[nextStep]
        };
        
        setMessages(prev => [...prev, botMessage]);
      } else {
        // Finish character creation
        finishCreation();
      }
    }, 1500);
  };

  const finishCreation = () => {
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      sender: "bot",
      content: "Perfect! Your character has been created. Let me save them for you..."
    };
    
    setMessages(prev => [...prev, botMessage]);

    // Create the complete character object
    const completeCharacter: InsertCharacter = {
      name: characterData.name || "Unnamed Character",
      personality: characterData.personality || "Mysterious",
      origin: characterData.origin || "Unknown lands",
      goals: characterData.goals || "To find their purpose",
      fears: characterData.fears || "The unknown",
      backstory: characterData.backstory || "A character with hidden depths",
      archetype: characterData.archetype || "Wanderer",
      avatar: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      personalityTraits: generatePersonalityTraits(characterData.personality || ""),
      tasteProfile: generateTasteProfile(characterData.personality || "", characterData.archetype || "")
    };

    setTimeout(() => {
      createCharacterMutation.mutate(completeCharacter);
    }, 2000);
  };

  return (
    <>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      
      <div className="fixed inset-0 z-50 bg-gradient-creative dark:bg-gradient-to-br dark:from-gray-900 dark:via-purple-900 dark:to-violet-900">
        <div className="container mx-auto h-full flex flex-col">
          {/* Header */}
          <motion.div 
            className="glass-effect border-b border-white/20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <Bot className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Character Creator
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Let's build your character together
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/")}
                className="hover:bg-white/30"
              >
                <X className="h-5 w-5" />
              </Button>
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
                  {message.sender === 'bot' && (
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="text-white text-sm" />
                    </div>
                  )}
                  
                  <Card className={`max-w-md ${
                    message.sender === 'user' 
                      ? 'bg-purple-500 text-white' 
                      : 'glass-effect border-white/20'
                  }`}>
                    <CardContent className="p-4">
                      {message.sender === 'bot' && index === messages.length - 1 && index > 0 ? (
                        <TypewriterText 
                          text={message.content}
                          className="text-gray-800 dark:text-white"
                        />
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

          {/* Character Preview */}
          {characterData.name && (
            <motion.div 
              className="mx-6 mb-4 glass-effect rounded-xl p-4 border-white/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-sky-500 rounded-full flex items-center justify-center">
                  <User className="text-white text-xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {characterData.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {characterData.personality ? 
                      characterData.personality.substring(0, 50) + "..." : 
                      "Building character..."
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Input Area */}
          <motion.div 
            className="p-6 glass-effect border-t border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
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
