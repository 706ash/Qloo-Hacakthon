// client/src/components/CharacterCard.tsx

import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { MessageCircle, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Character } from "@shared/schema";

interface CharacterCardProps {
  character: Character;
}

type PersonalityTag = {
  label: string;
  color: string;
};

const CharacterCard = ({ character }: CharacterCardProps) => {
  const [, setLocation] = useLocation();

  const getPersonalityTags = (
    traits: Character["personalityTraits"] | Record<string, number> | null | undefined
  ): PersonalityTag[] => {
    const tags: PersonalityTag[] = [];

    if (!traits || typeof traits !== "object") return tags;

    const colorMap: Record<string, string> = {
      wisdom: "bg-purple-500/20 text-purple-700",
      mystery: "bg-sky-500/20 text-sky-700",
      kindness: "bg-pink-500/20 text-pink-700",
      charisma: "bg-yellow-500/20 text-yellow-700",
      adventure: "bg-green-500/20 text-green-700",
      analytical: "bg-indigo-500/20 text-indigo-700",
    };

    Object.entries(traits).forEach(([trait, value]) => {
      if (typeof value === "number" && value > 70) {
        const label = trait.charAt(0).toUpperCase() + trait.slice(1);
        const color = colorMap[trait] ?? "bg-gray-300 text-gray-800";
        tags.push({ label, color });
      }
    });

    return tags.slice(0, 3); // Limit to 3 tags
  };

  const getLastConversationPreview = () => {
    const previews = {
      "Elven Mage": "The path ahead is shrouded in mist, but your heart knows the way...",
      "Space Smuggler": "Trust me, I've got a plan. It might be crazy, but it just might work...",
      "Victorian Detective": "The evidence points to a most peculiar conclusion, wouldn't you agree?",
    };

    return previews[character.archetype as keyof typeof previews] || "Ready for our next conversation...";
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
      onClick={() => setLocation(`/chat/${character.id}`)}
    >
      <Card className="glass-effect border-white/20 hover:shadow-xl transition-all duration-300 group overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative">
              {character.avatar ? (
                <img
                  src={character.avatar}
                  alt={character.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-sky-500 rounded-full flex items-center justify-center">
                  <User className="text-white text-xl" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white group-hover:text-purple-600 transition-colors">
                {character.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{character.archetype}</p>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <MessageCircle className="text-purple-500 text-xl" />
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
            {character.personality}
          </p>

          {/* Character Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {getPersonalityTags(character.personalityTraits).map((tag, index) => (
              <Badge key={index} variant="secondary" className={`${tag.color} text-xs font-medium`}>
                {tag.label}
              </Badge>
            ))}
          </div>

          {/* Last Chat Preview */}
          <div className="border-t border-white/30 pt-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last conversation</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 italic line-clamp-2">
              "{getLastConversationPreview()}"
            </p>
          </div>

          {/* Hover Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CharacterCard;
