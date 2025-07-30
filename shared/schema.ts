import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const characters = pgTable("characters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  personality: text("personality").notNull(),
  origin: text("origin").notNull(),
  goals: text("goals").notNull(),
  fears: text("fears").notNull(),
  backstory: text("backstory").notNull(),
  archetype: text("archetype").notNull(),
  avatar: text("avatar"),
  personalityTraits: jsonb("personality_traits").$type<{
    wisdom: number;
    mystery: number;
    kindness: number;
    charisma: number;
    adventure: number;
    analytical: number;
  }>().notNull(),
  tasteProfile: jsonb("taste_profile").$type<{
    music: string[];
    books: string[];
    movies: string[];
  }>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  characterId: varchar("character_id").references(() => characters.id).notNull(),
  messages: jsonb("messages").$type<Array<{
    id: string;
    sender: 'user' | 'character';
    content: string;
    timestamp: string;
  }>>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCharacterSchema = createInsertSchema(characters).omit({
  id: true,
  createdAt: true,
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
});

export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type Character = typeof characters.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;
