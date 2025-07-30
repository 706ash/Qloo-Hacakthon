import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCharacterSchema, insertConversationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all characters
  app.get("/api/characters", async (req, res) => {
    try {
      const characters = await storage.getAllCharacters();
      res.json(characters);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch characters" });
    }
  });

  // Get single character
  app.get("/api/characters/:id", async (req, res) => {
    try {
      const character = await storage.getCharacter(req.params.id);
      if (!character) {
        return res.status(404).json({ message: "Character not found" });
      }
      res.json(character);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch character" });
    }
  });

  // Create character
  app.post("/api/characters", async (req, res) => {
    try {
      const validatedData = insertCharacterSchema.parse(req.body);
      const character = await storage.createCharacter(validatedData);
      res.status(201).json(character);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid character data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create character" });
    }
  });

  // Update character
  app.patch("/api/characters/:id", async (req, res) => {
    try {
      const updates = insertCharacterSchema.partial().parse(req.body);
      const character = await storage.updateCharacter(req.params.id, updates);
      if (!character) {
        return res.status(404).json({ message: "Character not found" });
      }
      res.json(character);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid update data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update character" });
    }
  });

  // Delete character
  app.delete("/api/characters/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCharacter(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Character not found" });
      }
      res.json({ message: "Character deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete character" });
    }
  });

  // Get conversation for character
  app.get("/api/characters/:id/conversation", async (req, res) => {
    try {
      const conversation = await storage.getConversation(req.params.id);
      if (!conversation) {
        // Create empty conversation if none exists
        const newConversation = await storage.createConversation({
          characterId: req.params.id,
          messages: []
        });
        return res.json(newConversation);
      }
      res.json(conversation);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });

  // Add message to conversation
  app.post("/api/characters/:id/messages", async (req, res) => {
    try {
      const { content, sender } = req.body;
      if (!content || !sender) {
        return res.status(400).json({ message: "Message content and sender are required" });
      }

      let conversation = await storage.getConversation(req.params.id);
      if (!conversation) {
        conversation = await storage.createConversation({
          characterId: req.params.id,
          messages: []
        });
      }

      const newMessage = {
        id: Date.now().toString(),
        sender: sender as 'user' | 'character',
        content,
        timestamp: new Date().toISOString()
      };

      const updatedMessages = [...conversation.messages, newMessage];
      const updatedConversation = await storage.updateConversation(conversation.id, {
        messages: updatedMessages
      });

      res.json(updatedConversation);
    } catch (error) {
      res.status(500).json({ message: "Failed to add message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
