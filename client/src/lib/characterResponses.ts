import { type Character } from "@shared/schema";

interface Message {
  id: string;
  sender: 'user' | 'character';
  content: string;
  timestamp: string;
}

export const generateCharacterResponse = (
  character: Character,
  userMessage: string,
  conversationHistory: Message[]
): string => {
  const messageWords = userMessage.toLowerCase().split(' ');
  
  // Analyze user intent
  const isAskingAboutCharacter = messageWords.some(word => 
    ['tell', 'about', 'yourself', 'who', 'are', 'you'].includes(word)
  );
  
  const needsInspiration = messageWords.some(word =>
    ['inspiration', 'stuck', 'help', 'creative', 'block', 'idea'].includes(word)
  );
  
  const isStoryHelp = messageWords.some(word =>
    ['story', 'plot', 'character', 'scene', 'dialogue', 'writing'].includes(word)
  );
  
  const isMoralDilemma = messageWords.some(word =>
    ['moral', 'choice', 'decision', 'dilemma', 'should', 'right', 'wrong'].includes(word)
  );

  // Character-specific response patterns
  const archetypeResponses = getArchetypeResponses(character.archetype);
  
  // Generate response based on context and personality
  if (isAskingAboutCharacter) {
    return generateSelfIntroduction(character);
  }
  
  if (needsInspiration) {
    return generateInspirationResponse(character, archetypeResponses);
  }
  
  if (isStoryHelp) {
    return generateStoryHelpResponse(character, archetypeResponses);
  }
  
  if (isMoralDilemma) {
    return generateMoralAdviceResponse(character, archetypeResponses);
  }
  
  // Default conversational response
  return generateDefaultResponse(character, archetypeResponses, userMessage);
};

const generateSelfIntroduction = (character: Character): string => {
  const intros = {
    "Elven Mage": [
      `I am ${character.name}, keeper of ancient wisdom from ${character.origin}. The forest spirits have guided me for centuries, teaching me the delicate balance between magic and nature.`,
      `Greetings, I am ${character.name}. I've spent lifetimes studying the mystical arts in ${character.origin}, where every leaf whispers secrets of the universe.`,
    ],
    "Space Smuggler": [
      `The name's ${character.name}, and I've been running cargo across the galaxy longer than most folks have been breathing. ${character.origin} taught me that sometimes you gotta bend the rules to do what's right.`,
      `${character.name} here. I've seen more star systems than I can count, survived more close calls than I care to remember. Growing up in ${character.origin} taught me to always have an escape plan.`,
    ],
    "Victorian Detective": [
      `I am Dr. ${character.name}, a consulting detective operating in the fog-shrouded streets of London. My methods may be unconventional, but logic and observation rarely fail me.`,
      `${character.name} at your service. I've dedicated my life to unraveling the mysteries that confound Scotland Yard, using reason where others see only chaos.`,
    ],
  };
  
  const responses = intros[character.archetype as keyof typeof intros] || [
    `I'm ${character.name}, and I've lived quite a journey. ${character.backstory} shaped who I am today.`,
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

const generateInspirationResponse = (character: Character, responses: any): string => {
  const trait = getHighestTrait(character.personalityTraits);
  
  if (trait === 'wisdom') {
    return responses.inspiration.wise[Math.floor(Math.random() * responses.inspiration.wise.length)];
  } else if (trait === 'charisma') {
    return responses.inspiration.charismatic[Math.floor(Math.random() * responses.inspiration.charismatic.length)];
  } else if (trait === 'adventure') {
    return responses.inspiration.adventurous[Math.floor(Math.random() * responses.inspiration.adventurous.length)];
  }
  
  return responses.inspiration.general[Math.floor(Math.random() * responses.inspiration.general.length)];
};

const generateStoryHelpResponse = (character: Character, responses: any): string => {
  return responses.storyHelp[Math.floor(Math.random() * responses.storyHelp.length)];
};

const generateMoralAdviceResponse = (character: Character, responses: any): string => {
  return responses.moralAdvice[Math.floor(Math.random() * responses.moralAdvice.length)];
};

const generateDefaultResponse = (character: Character, responses: any, userMessage: string): string => {
  return responses.general[Math.floor(Math.random() * responses.general.length)];
};

const getHighestTrait = (traits: Character['personalityTraits']): string => {
  return Object.entries(traits).reduce((a, b) => traits[a[0] as keyof typeof traits] > traits[b[0] as keyof typeof traits] ? a : b)[0];
};

const getArchetypeResponses = (archetype: string) => {
  const responses = {
    "Elven Mage": {
      general: [
        "The ancient trees whisper secrets to those who know how to listen. What wisdom do you seek today?",
        "In my centuries of existence, I've learned that every challenge carries within it the seed of growth.",
        "The forest spirits tell me you have a creative heart. Let it guide you through uncertainty.",
        "Magic flows through all things, even through the stories we tell. What tale wishes to be born through you?",
      ],
      inspiration: {
        wise: [
          "When the path seems unclear, remember that even the mightiest oak began as a small acorn. Your ideas need time to take root and grow.",
          "The moon phases teach us that creativity, like all natural things, has its seasons. Perhaps this is your time for reflection before the next burst of inspiration.",
        ],
        charismatic: [
          "Your creative spirit shines bright, but every flame needs kindling. What small spark can you nurture today?",
          "I sense great potential within you. Trust in your unique voice - the world needs stories only you can tell.",
        ],
        adventurous: [
          "Adventure often begins with a single step into the unknown. What unexplored idea calls to your heart?",
          "The greatest journeys start with curiosity. What question about your story world keeps you awake at night?",
        ],
        general: [
          "Creativity is like magic - it flows best when we stop trying to control it and simply become vessels for its expression.",
          "Every master was once a beginner. Every expert was once amateur. Your creative journey is sacred, no matter where you are on the path.",
        ],
      },
      storyHelp: [
        "Ah, the art of storytelling. In my experience, the most powerful stories often begin with a character's deepest fear or greatest desire. What drives your protagonist?",
        "The forest has taught me that every ending contains a new beginning. How might your story's conclusion plant seeds for future growth?",
        "Magic systems in stories, like real magic, must have rules and costs. What price must your characters pay for their power?",
      ],
      moralAdvice: [
        "True moral dilemmas often reveal character more than they resolve situations. What does your protagonist value most deeply? Their choice will flow from that truth.",
        "In the old tales, the greatest heroes weren't those who never made mistakes, but those who learned wisdom from their failures. How might your character grow through this choice?",
        "The forest spirits taught me that sometimes the right path isn't the easy one. What would your character choose if they knew no one would ever know their decision?",
      ],
    },
    "Space Smuggler": {
      general: [
        "Hey there, partner! Another day, another adventure waiting to unfold. What's the mission?",
        "You know, I've been in tight spots before, but the best way out is usually straight through. What's got you stuck?",
        "Trust me, I've seen enough of the galaxy to know that every problem has a solution - you just gotta think outside the spaceship.",
        "Life's too short to play it safe all the time. Sometimes the craziest plan is the one that works.",
      ],
      inspiration: {
        wise: [
          "You know what I've learned in all my travels? The best ideas come when you're not trying so hard. Take a step back, grab a drink, and let your mind wander.",
          "I've smuggled cargo through asteroid fields and past Imperial blockades. The secret? Stay flexible and trust your instincts.",
        ],
        charismatic: [
          "Hey, everyone hits a rough patch now and then. The trick is to remember that every great story needs some obstacles - otherwise, where's the fun?",
          "You've got that spark, I can tell. Sometimes you just need to stop overthinking and trust the process. The universe has a way of providing.",
        ],
        adventurous: [
          "Feeling stuck? Sounds like you need a change of scenery! Sometimes the best ideas come when you least expect them.",
          "The galaxy's full of possibilities, partner. What if you took your story somewhere completely unexpected?",
        ],
        general: [
          "Look, I've learned that sometimes you gotta make your own luck. What bold move could shake things up for your story?",
          "Every smuggler knows that the cargo you're not supposed to carry is usually the most valuable. What forbidden idea are you avoiding?",
        ],
      },
      storyHelp: [
        "Alright, story problems - my specialty! See, every good heist needs three things: a clear goal, a clever plan, and something that goes completely wrong. How does this apply to your tale?",
        "Characters are like crew members - each one needs a role, a skill, and a reason they can't walk away. What keeps your characters invested in the outcome?",
        "The best adventures start with someone taking a job they probably shouldn't. What's the 'job' your protagonist can't refuse?",
      ],
      moralAdvice: [
        "Moral dilemmas, huh? I've faced plenty. Here's what I've learned: sometimes doing the 'right' thing means breaking a few rules. What matters more - the law or what's actually just?",
        "You know, the galaxy's not black and white - it's all shades of gray out there. Your character's gotta decide what they can live with. What would haunt them more - action or inaction?",
        "I've learned that the choices that seem impossible usually aren't. There's almost always a third option - you just gotta be creative enough to find it.",
      ],
    },
    "Victorian Detective": {
      general: [
        "Ah, a most intriguing puzzle presents itself. Every mystery has a pattern, we simply must observe carefully.",
        "In my experience, the most obvious solution is often a clever misdirection. What details might we be overlooking?",
        "The fog of London may obscure the streets, but logic illuminates the darkest corners of any mystery.",
        "Every character, much like every person, has hidden depths. What layers might your protagonist be concealing?",
      ],
      inspiration: {
        wise: [
          "When the mind feels clouded, I find it helpful to approach the problem as one would a crime scene. What evidence do you have? What assumptions might you be making?",
          "The greatest breakthroughs often come not from finding new information, but from seeing existing information in a new light.",
        ],
        charismatic: [
          "Creativity, like detective work, requires both methodical analysis and intuitive leaps. You possess both qualities - trust in them.",
          "Every master detective knows that the smallest detail can unlock the entire case. What small element of your story might hold the key?",
        ],
        adventurous: [
          "The thrill of the chase is what drives us, is it not? What mystery within your story excites you most to solve?",
          "Sometimes we must follow the clues wherever they lead, even into uncharted territory. What unexplored path beckons to you?",
        ],
        general: [
          "Observation and deduction are powerful tools, but so is imagination. What would happen if you let your creativity run wild for just a moment?",
          "Every case teaches us something new. What has your current creative challenge taught you about yourself or your craft?",
        ],
      },
      storyHelp: [
        "Ah, the craft of narrative construction! Like a good mystery, every story needs clues, red herrings, and a satisfying revelation. What truth is your story building toward?",
        "Character motivation is like a criminal's motive - it must be clear, compelling, and personal. What drives your characters to act as they do?",
        "The best plot twists are both surprising and inevitable. When the reader looks back, they should see all the clues were there. How might you plant such seeds?",
      ],
      moralAdvice: [
        "Moral complexity makes for the most interesting cases, and the most interesting characters. What if neither choice is entirely right or wrong?",
        "In my investigations, I've learned that people rarely act from pure motives. What conflicting desires might be driving your character's dilemma?",
        "The truth has a way of revealing itself, but it's rarely simple. What uncomfortable truth might your character be avoiding?",
      ],
    },
  };
  
  return responses[archetype as keyof typeof responses] || responses["Elven Mage"];
};
