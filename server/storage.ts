import { type Character, type InsertCharacter, type Conversation, type InsertConversation } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Character methods
  getCharacter(id: string): Promise<Character | undefined>;
  getAllCharacters(): Promise<Character[]>;
  createCharacter(character: InsertCharacter): Promise<Character>;
  updateCharacter(id: string, updates: Partial<InsertCharacter>): Promise<Character | undefined>;
  deleteCharacter(id: string): Promise<boolean>;
  
  // Conversation methods
  getConversation(characterId: string): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: string, updates: Partial<InsertConversation>): Promise<Conversation | undefined>;
}

export class MemStorage implements IStorage {
  private characters: Map<string, Character>;
  private conversations: Map<string, Conversation>;

  constructor() {
    this.characters = new Map();
    this.conversations = new Map();
  }

  async getCharacter(id: string): Promise<Character | undefined> {
    return this.characters.get(id);
  }

  async getAllCharacters(): Promise<Character[]> {
    return Array.from(this.characters.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createCharacter(insertCharacter: InsertCharacter): Promise<Character> {
    const id = randomUUID();
    const character: Character = {
      ...insertCharacter,
      id,
      avatar: insertCharacter.avatar ?? null,
      personalityTraits: { ...insertCharacter.personalityTraits },
      tasteProfile: {
        music: [...insertCharacter.tasteProfile.music],
        books: [...insertCharacter.tasteProfile.books],
        movies: [...insertCharacter.tasteProfile.movies],
      },
      createdAt: new Date(),
    };
    this.characters.set(id, character);
    return character;
  }

  async updateCharacter(id: string, updates: Partial<InsertCharacter>): Promise<Character | undefined> {
    const character = this.characters.get(id);
    if (!character) return undefined;
    
    const updatedCharacter: Character = { 
      ...character, 
      ...updates,
      personalityTraits: updates.personalityTraits ? { ...updates.personalityTraits } : character.personalityTraits,
      tasteProfile: updates.tasteProfile ? {
        music: [...updates.tasteProfile.music],
        books: [...updates.tasteProfile.books],
        movies: [...updates.tasteProfile.movies],
      } : character.tasteProfile,
    };
    this.characters.set(id, updatedCharacter);
    return updatedCharacter;
  }

  async deleteCharacter(id: string): Promise<boolean> {
    const deleted = this.characters.delete(id);
    // Also delete associated conversations
    const entries = Array.from(this.conversations.entries());
    for (const [convId, conv] of entries) {
      if (conv.characterId === id) {
        this.conversations.delete(convId);
      }
    }
    return deleted;
  }

  async getConversation(characterId: string): Promise<Conversation | undefined> {
    return Array.from(this.conversations.values()).find(conv => conv.characterId === characterId);
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = randomUUID();
    const conversation: Conversation = {
      ...insertConversation,
      id,
      messages: insertConversation.messages.map((msg: any) => ({
        id: msg.id,
        sender: msg.sender as 'user' | 'character',
        content: msg.content,
        timestamp: msg.timestamp
      })),
      createdAt: new Date(),
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async updateConversation(id: string, updates: Partial<InsertConversation>): Promise<Conversation | undefined> {
    const conversation = this.conversations.get(id);
    if (!conversation) return undefined;
    
    const updatedConversation: Conversation = { 
      ...conversation, 
      ...updates,
      messages: updates.messages ? updates.messages.map((msg: any) => ({
        id: msg.id,
        sender: msg.sender as 'user' | 'character',
        content: msg.content,
        timestamp: msg.timestamp
      })) : conversation.messages
    };
    this.conversations.set(id, updatedConversation);
    return updatedConversation;
  }
}

export const storage = new MemStorage();
