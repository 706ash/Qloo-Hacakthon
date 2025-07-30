import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { MessageCircle, Users, Lightbulb, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun } from "lucide-react";

const Landing = () => {
  const [, setLocation] = useLocation();
  const { theme, setTheme } = useTheme();

  const features = [
    {
      icon: MessageCircle,
      title: "Interactive Chats",
      description: "Have natural conversations with your characters",
      color: "text-purple-500",
    },
    {
      icon: Users,
      title: "Character Builder",
      description: "Create detailed personalities and backstories",
      color: "text-sky-500",
    },
    {
      icon: Lightbulb,
      title: "Get Inspired",
      description: "Break through creative blocks instantly",
      color: "text-pink-500",
    },
  ];

  return (
    <div className="relative z-10">
      {/* Header */}
      <header className="glass-effect border-b border-white/20">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <MessageCircle className="text-2xl text-purple-500" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">CharacterChat</h1>
          </motion.div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="glass-effect hover:bg-white/30"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => setLocation("/dashboard")}
              className="hidden md:flex glass-effect hover:bg-white/30"
            >
              Dashboard
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-bold text-gray-800 dark:text-white mb-8 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Stuck?
              <motion.span 
                className="block text-purple-500"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                Chat with Your Character
              </motion.span>
              <motion.span 
                className="block text-4xl md:text-6xl text-sky-500"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                for Inspiration.
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Bring your fictional characters to life through interactive conversations. 
              Perfect for authors, artists, and game designers who need creative inspiration.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Button
                size="lg"
                onClick={() => setLocation("/create")}
                className="group relative px-12 py-6 bg-purple-500 hover:bg-purple-600 text-white rounded-2xl font-semibold text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center justify-center space-x-3">
                  <motion.div
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Plus className="text-2xl" />
                  </motion.div>
                  <span>Create a Character</span>
                </span>
              </Button>
            </motion.div>
          </motion.div>

          {/* Feature Preview */}
          <motion.div 
            className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, staggerChildren: 0.2 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + index * 0.2 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className="glass-effect border-white/20 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <feature.icon className={`text-4xl ${feature.color} mb-4 mx-auto`} />
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-effect border-t border-white/20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <MessageCircle className="text-xl text-purple-500" />
              <span className="text-lg font-semibold text-gray-800 dark:text-white">CharacterChat</span>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-300 text-center md:text-right">
              <p className="mb-2">Built using Qloo's Taste API + AI imagination</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
