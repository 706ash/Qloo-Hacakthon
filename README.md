# CharacterChat Application

> **Bring Your Characters to Life Through AI Conversations**

## Overview

CharacterChat is a full-stack web application that allows users to create and interact with custom AI characters through chat conversations. The application features a React frontend with a Node.js/Express backend, utilizing PostgreSQL for data persistence through Drizzle ORM.

### Features

### 🏠 Landing Page - Creative Inspiration Hub
![Landing Page](screenshots/landing-page.png)

**Features showcased:**
- **Modern Gradient Design**: Beautiful blue-to-pink gradient background with subtle icon overlays
- **Clear Value Proposition**: "Stuck? Chat with Your Character for Inspiration"
- **Target Audience Focus**: Perfect for authors, artists, and game designers
- **Quick Action**: Prominent "+ Create a Character" button for immediate engagement
- **Feature Highlights**: Three key benefit cards explaining Interactive Chats, Character Builder, and Creative Inspiration

### 📱 Character Dashboard - Character Management
![Character Dashboard](screenshots/character-dashboard.png)

**Features showcased:**
- **Character Grid Layout**: Clean, organized display of all created characters
- **Character Profiles**: Each character shows name, role, and conversation status
- **Online Status Indicators**: Green dots showing character availability
- **Easy Navigation**: Dark mode toggle and home navigation
- **Character Diversity**: Various character types (Hero, Trickster, Prophet, etc.)
- **Quick Access**: "Create New Character" button prominently displayed

### 🤖 Character Creator - AI-Powered Creation
![Character Creator](screenshots/character-creator.png)

**Features showcased:**
- **Conversational UI**: Natural chat-based character creation process
- **AI Guidance**: Intelligent prompts to help users define character traits
- **Taste Profile Integration**: Detailed character preferences (food, music, etc.)
- **User-Friendly Interface**: Clean chat interface with clear input areas
- **Step-by-Step Process**: Guided character development through conversation

### 💬 Interactive Chat - Character Conversations
![Interactive Chat](screenshots/interactive-chat.png)

**Features showcased:**
- **Real-time Messaging**: Natural conversation flow with character responses
- **Character Personality**: Each character has unique voice and responses
- **Quick Prompts**: Suggested conversation starters for easy interaction
- **Status Indicators**: Online status and character role display
- **Responsive Design**: Clean, modern chat interface with intuitive controls
- **Creative Inspiration**: Characters designed to help with creative projects

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Animations**: Framer Motion for smooth animations and transitions
- **Build Tool**: Vite for development and bundling

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API design
- **Development Server**: Custom Vite integration for hot module replacement
- **Request Handling**: Express middleware for JSON parsing, CORS, and request logging

### Database Architecture
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with schema-first approach
- **Migrations**: Drizzle Kit for database schema management
- **Schema Location**: Shared schema definitions in `/shared/schema.ts`

## Key Components

### Data Models
- **Characters**: Core entities with personality traits, backstory, goals, fears, and taste profiles
- **Conversations**: Message history associated with characters
- **Personality Traits**: Numeric scores for wisdom, mystery, kindness, charisma, adventure, and analytical traits
- **Taste Profiles**: JSON objects containing music, books, and movie preferences

### Character Creation System
- **Interactive Wizard**: Step-by-step character creation with conversational UI
- **Personality Mapping**: Quantified personality traits that influence responses
- **Rich Backstories**: Comprehensive character backgrounds including origin, goals, and fears

### Chat System
- **Real-time Messaging**: Character-user conversations with typewriter effects
- **Character Response Engine**: Rule-based response generation based on personality traits
- **Message Persistence**: Conversation history storage and retrieval

### UI Components
- **Theme System**: Light/dark mode support with custom CSS variables
- **Responsive Design**: Mobile-first approach with glass morphism effects
- **Component Library**: Comprehensive set of reusable UI components based on Radix UI

## Data Flow

### Character Creation Flow
1. User navigates to creation wizard
2. Step-by-step form collection of character attributes
3. Personality trait quantification through user responses
4. Character data validation using Zod schemas
5. API call to create character in database
6. Redirect to dashboard with new character displayed

### Chat Interaction Flow
1. User selects character from dashboard
2. Character data and conversation history loaded via React Query
3. User submits message through chat interface
4. Client-side character response generation based on personality
5. Message pair stored in database
6. UI updates with typewriter animation for character response

### Data Persistence Flow
1. All database operations go through Drizzle ORM
2. Schema validation using drizzle-zod integration
3. Type-safe database queries with TypeScript
4. Connection pooling handled by @neondatabase/serverless

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React 18, React DOM, React Query for state management
- **UI Framework**: Radix UI primitives, shadcn/ui components, Tailwind CSS
- **Database**: Drizzle ORM, @neondatabase/serverless, connect-pg-simple
- **Validation**: Zod for runtime type checking and schema validation
- **Animation**: Framer Motion for UI animations
- **Utilities**: date-fns for date handling, clsx for conditional styling

### Development Dependencies
- **Build Tools**: Vite with React plugin, esbuild for production builds
- **TypeScript**: Full TypeScript support with strict configuration
- **Development Experience**: Hot module replacement, error overlays, source maps

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express API integration
- **Hot Reloading**: Full-stack hot module replacement
- **Database**: Connection to remote PostgreSQL via DATABASE_URL environment variable

### Production Build
- **Frontend**: Vite build outputting to `dist/public`
- **Backend**: esbuild compilation to `dist/index.js`
- **Deployment**: Single Node.js server serving both API and static files
- **Environment**: Production mode detection and optimization

### Database Management
- **Schema Deployment**: `npm run db:push` for schema updates
- **Migrations**: Drizzle Kit generates and manages SQL migrations
- **Connection**: Serverless PostgreSQL optimized for edge deployment

The application uses a modern, type-safe stack optimized for developer experience and production performance, with a focus on real-time character interactions and rich personality simulation.
