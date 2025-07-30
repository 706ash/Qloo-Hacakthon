import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Plus, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import CharacterCard from "@/components/CharacterCard";
import { type Character } from "@shared/schema";
import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun } from "lucide-react";

const Dashboard = () => {
  const [, setLocation] = useLocation();
  const { theme, setTheme } = useTheme();

  const { data: characters = [], isLoading } = useQuery<Character[]>({
    queryKey: ["/api/characters"],
  });

  const stats = [
    { label: "Characters Created", value: characters.length, color: "text-purple-500" },
    { label: "Conversations", value: characters.length * 8, color: "text-sky-500" },
    { label: "Hours Chatting", value: Math.floor(characters.length * 2.5), color: "text-pink-500" },
  ];

  return (
    <div className="relative z-10 min-h-screen">
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
              onClick={() => setLocation("/")}
              className="glass-effect hover:bg-white/30"
            >
              Home
            </Button>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-6 py-20 max-w-6xl">
        {/* Dashboard Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Your Characters
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Click on any character to start a conversation
          </p>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => setLocation("/create")}
              className="inline-flex items-center space-x-3 px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-semibold text-lg"
            >
              <Plus className="text-xl" />
              <span>Create New Character</span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Characters Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="glass-effect border-white/20">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="h-3 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : characters.length === 0 ? (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card className="glass-effect border-2 border-dashed border-purple-400/40 max-w-md mx-auto">
              <CardContent className="p-12">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="text-2xl text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  No Characters Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Create your first character to get started
                </p>
                <Button
                  onClick={() => setLocation("/create")}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  Create Character
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {characters.map((character, index) => (
              <motion.div
                key={character.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CharacterCard character={character} />
              </motion.div>
            ))}
            
            {/* Add New Character Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: characters.length * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="cursor-pointer"
              onClick={() => setLocation("/create")}
            >
              <Card className="glass-effect border-2 border-dashed border-purple-400/40 hover:border-purple-400 transition-all duration-300 min-h-[300px] flex items-center justify-center">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-purple-500/30 transition-colors duration-300">
                    <Plus className="text-2xl text-purple-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    Create New Character
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Bring another character to life
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Dashboard Statistics */}
        {characters.length > 0 && (
          <motion.div 
            className="mt-16 grid md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="glass-effect border-white/20 text-center">
                  <CardContent className="p-6">
                    <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                      {stat.value}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
