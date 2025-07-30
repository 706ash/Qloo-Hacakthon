import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type Character } from "@shared/schema";
import { useLocation } from "wouter";

interface CharacterSettingsProps {
  character: Character;
  isOpen: boolean;
  onClose: () => void;
}

const CharacterSettings = ({ character, isOpen, onClose }: CharacterSettingsProps) => {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: character.name,
    archetype: character.archetype,
    personality: character.personality,
    origin: character.origin,
    goals: character.goals,
    fears: character.fears,
    backstory: character.backstory,
    personalityTraits: { ...character.personalityTraits },
    tasteProfile: { ...character.tasteProfile },
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateCharacterMutation = useMutation({
    mutationFn: async (updates: Partial<Character>) => {
      const response = await apiRequest("PATCH", `/api/characters/${character.id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/characters"] });
      queryClient.invalidateQueries({ queryKey: ["/api/characters", character.id] });
      toast({
        title: "Character Updated",
        description: "Your character has been successfully updated.",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update character. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteCharacterMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/characters/${character.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/characters"] });
      toast({
        title: "Character Deleted",
        description: "Your character has been deleted.",
      });
      setLocation("/dashboard");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete character. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateCharacterMutation.mutate(formData);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this character? This action cannot be undone.")) {
      deleteCharacterMutation.mutate();
    }
  };

  const updatePersonalityTrait = (trait: keyof typeof formData.personalityTraits, value: number) => {
    setFormData(prev => ({
      ...prev,
      personalityTraits: {
        ...prev.personalityTraits,
        [trait]: value,
      },
    }));
  };

  const addMusicGenre = (genre: string) => {
    if (!formData.tasteProfile.music.includes(genre)) {
      setFormData(prev => ({
        ...prev,
        tasteProfile: {
          ...prev.tasteProfile,
          music: [...prev.tasteProfile.music, genre],
        },
      }));
    }
  };

  const removeMusicGenre = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      tasteProfile: {
        ...prev.tasteProfile,
        music: prev.tasteProfile.music.filter(g => g !== genre),
      },
    }));
  };

  const popularGenres = ["Classical", "Jazz", "Rock", "Pop", "Electronic", "Folk", "Celtic", "Ambient"];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass-effect rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Character</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="glass-effect border-white/30 bg-white/50 dark:bg-black/20"
                  />
                </div>
                <div>
                  <Label htmlFor="archetype">Archetype</Label>
                  <Input
                    id="archetype"
                    value={formData.archetype}
                    onChange={(e) => setFormData(prev => ({ ...prev, archetype: e.target.value }))}
                    className="glass-effect border-white/30 bg-white/50 dark:bg-black/20"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="personality">Personality</Label>
                <Textarea
                  id="personality"
                  rows={3}
                  value={formData.personality}
                  onChange={(e) => setFormData(prev => ({ ...prev, personality: e.target.value }))}
                  className="glass-effect border-white/30 bg-white/50 dark:bg-black/20"
                />
              </div>

              {/* Origin & Goals */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="origin">Origin</Label>
                  <Input
                    id="origin"
                    value={formData.origin}
                    onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))}
                    className="glass-effect border-white/30 bg-white/50 dark:bg-black/20"
                  />
                </div>
                <div>
                  <Label htmlFor="goals">Goals</Label>
                  <Input
                    id="goals"
                    value={formData.goals}
                    onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
                    className="glass-effect border-white/30 bg-white/50 dark:bg-black/20"
                  />
                </div>
              </div>

              {/* Personality Traits */}
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 block">
                  Personality Traits
                </Label>
                <div className="space-y-4">
                  {Object.entries(formData.personalityTraits).map(([trait, value]) => (
                    <div key={trait}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                          {trait}
                        </span>
                        <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                          {value}%
                        </span>
                      </div>
                      <Slider
                        value={[value]}
                        onValueChange={([newValue]) => updatePersonalityTrait(trait as keyof typeof formData.personalityTraits, newValue)}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Music Preferences */}
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Favorite Music Genres
                </Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tasteProfile.music.map((genre, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-purple-500/20 text-purple-700 cursor-pointer hover:bg-purple-500/30"
                      onClick={() => removeMusicGenre(genre)}
                    >
                      {genre} ×
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularGenres
                    .filter(genre => !formData.tasteProfile.music.includes(genre))
                    .map((genre, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        onClick={() => addMusicGenre(genre)}
                        className="text-xs glass-effect hover:bg-purple-500/20"
                      >
                        + {genre}
                      </Button>
                    ))}
                </div>
              </div>

              {/* Backstory */}
              <div>
                <Label htmlFor="backstory">Backstory</Label>
                <Textarea
                  id="backstory"
                  rows={4}
                  value={formData.backstory}
                  onChange={(e) => setFormData(prev => ({ ...prev, backstory: e.target.value }))}
                  className="glass-effect border-white/30 bg-white/50 dark:bg-black/20"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6">
                <Button
                  onClick={handleSave}
                  disabled={updateCharacterMutation.isPending}
                  className="flex-1 bg-purple-500 hover:bg-purple-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteCharacterMutation.isPending}
                  className="px-6"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CharacterSettings;
