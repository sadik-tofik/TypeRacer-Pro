export interface DifficultyLevel {
  id: string;
  name: string;
  description: string;
  timeLimit: number; // in seconds
  color: string;
  icon: string;
}

export const difficultyLevels: DifficultyLevel[] = [
  {
    id: 'easy',
    name: 'Easy',
    description: 'Short sentences with common words',
    timeLimit: 60,
    color: 'green',
    icon: '🌱'
  },
  {
    id: 'medium',
    name: 'Medium',
    description: 'Paragraphs with moderate complexity',
    timeLimit: 90,
    color: 'blue',
    icon: '⚡'
  },
  {
    id: 'hard',
    name: 'Hard',
    description: 'Long passages with complex vocabulary',
    timeLimit: 120,
    color: 'red',
    icon: '🔥'
  }
];

export const typingTexts = {
  easy: [
    "The sun shines bright today. Birds sing in the trees. Children play in the park. Life is beautiful and simple.",
    "I love to read books. They take me to new worlds. Stories help me learn and grow. Reading is my favorite hobby.",
    "Cats are wonderful pets. They purr when they are happy. Dogs are loyal friends too. Animals bring joy to our lives.",
    "The ocean is vast and blue. Waves crash on the shore. Seashells wash up on the beach. The sea is full of mysteries.",
    "Flowers bloom in spring. Colors fill the garden. Bees buzz from flower to flower. Nature awakens from winter sleep.",
    "Music fills the air with joy. Melodies dance in our hearts. Rhythm moves our bodies. Songs tell stories of life.",
    "Friends gather around the table. Laughter echoes through the room. Stories are shared with warm smiles. Memories are made together.",
    "The library is quiet and peaceful. Books line the tall shelves. Knowledge waits to be discovered. Learning never truly ends.",
    "Morning coffee smells divine. Steam rises from the warm cup. The first sip awakens the senses. A new day begins with hope.",
    "Stars twinkle in the night sky. The moon casts silver light. Dreams float on gentle breezes. Sleep brings peaceful rest."
  ],
  medium: [
    "Technology has revolutionized the way we communicate and work. From smartphones to artificial intelligence, innovation continues to shape our daily lives. The digital age has brought both opportunities and challenges that we must navigate carefully.",
    "Climate change is one of the most pressing issues of our time. Rising temperatures, melting ice caps, and extreme weather events are clear indicators that immediate action is needed. Sustainable practices and renewable energy sources are crucial for our planet's future.",
    "The art of cooking combines creativity with science. Understanding how ingredients interact, the importance of timing, and the balance of flavors can transform simple ingredients into extraordinary meals. Culinary skills are both practical and deeply satisfying to develop.",
    "Education is the foundation of personal growth and societal progress. It opens doors to new opportunities, develops critical thinking skills, and fosters innovation. Lifelong learning has become essential in our rapidly changing world.",
    "Space exploration continues to capture human imagination and drive scientific advancement. From the first moon landing to Mars rovers, each mission expands our understanding of the universe and our place within it.",
    "The human brain is an incredibly complex organ that scientists are still working to understand. Neuroplasticity allows our brains to adapt and change throughout our lives. Memory, emotion, and consciousness remain fascinating areas of research.",
    "Sustainable agriculture practices are becoming increasingly important as the global population grows. Farmers are adopting new techniques that protect soil health, conserve water, and reduce environmental impact while maintaining crop yields.",
    "The history of human civilization is marked by remarkable achievements in art, science, and culture. Ancient civilizations laid the groundwork for modern society through their innovations in writing, mathematics, and governance.",
    "Mental health awareness has grown significantly in recent years. Understanding the importance of emotional well-being, stress management, and seeking help when needed has become a priority for individuals and communities worldwide.",
    "The power of storytelling transcends cultures and generations. Whether through books, films, or oral traditions, stories help us understand ourselves and others while preserving important lessons and values for future generations."
  ],
  hard: [
    "The philosophical implications of artificial intelligence extend far beyond mere technological advancement, challenging our fundamental understanding of consciousness, creativity, and what it means to be human. As machine learning algorithms become increasingly sophisticated, we must grapple with questions about the nature of intelligence itself, the potential for artificial consciousness, and the ethical responsibilities that come with creating entities that may one day surpass human cognitive abilities. This technological revolution demands careful consideration of how we integrate AI into society while preserving human agency and dignity.",
    "Quantum mechanics represents one of the most counterintuitive yet successful theories in the history of science, describing a reality where particles exist in multiple states simultaneously until observed, where the act of measurement fundamentally alters the system being studied, and where distant particles can be instantaneously connected through quantum entanglement. These phenomena challenge our classical understanding of reality and have led to revolutionary applications in computing, cryptography, and telecommunications, while simultaneously raising profound questions about the nature of reality, determinism, and the role of consciousness in the physical world.",
    "The intricate relationship between language, thought, and culture has fascinated scholars for centuries, with debates ranging from whether language shapes our perception of reality to how cultural contexts influence linguistic evolution. Linguistic relativity suggests that the structure and vocabulary of our language may influence how we categorize and understand the world around us, while universal grammar theories propose that all human languages share fundamental structural similarities rooted in our biological nature. This complex interplay between cognition, communication, and cultural transmission continues to reveal new insights about human nature and social organization.",
    "Biodiversity represents the intricate web of life on Earth, encompassing not only the variety of species but also genetic diversity within populations and the complex ecosystems that support all living organisms. The current rate of species extinction, often referred to as the sixth mass extinction, is occurring at an unprecedented pace due to human activities including habitat destruction, climate change, pollution, and overexploitation of natural resources. Conservation efforts must address these multifaceted challenges through integrated approaches that consider ecological, economic, and social factors while promoting sustainable development practices that can support both human welfare and environmental health.",
    "The emergence of global interconnectedness through digital networks has fundamentally transformed how information flows across geographical and cultural boundaries, creating new opportunities for collaboration, innovation, and cultural exchange while simultaneously presenting challenges related to privacy, security, and the spread of misinformation. This digital revolution has democratized access to knowledge and communication tools, enabling grassroots movements and individual voices to reach global audiences, yet it has also concentrated unprecedented power in the hands of technology companies and raised concerns about digital divides, algorithmic bias, and the manipulation of public opinion through sophisticated data analytics and targeted messaging systems.",
    "The study of human consciousness remains one of the most perplexing challenges in neuroscience and philosophy, as researchers attempt to understand how subjective experiences arise from neural activity and whether consciousness can be fully explained through physical processes. The hard problem of consciousness, as formulated by philosopher David Chalmers, questions why we have qualitative, subjective experiences at all, and how these phenomenal experiences relate to the objective, measurable aspects of brain function. Recent advances in neuroimaging, computational modeling, and theoretical frameworks have provided new insights into the neural correlates of consciousness, yet the fundamental questions about the nature of subjective experience, free will, and the unity of conscious awareness continue to challenge our understanding of what it means to be a conscious being.",
    "The concept of time has puzzled philosophers, physicists, and thinkers throughout history, leading to profound questions about its fundamental nature and our perception of temporal flow. Einstein's theory of relativity revealed that time is not absolute but relative to the observer's frame of reference, fundamentally altering our understanding of simultaneity and causality. The arrow of time, thermodynamics, and entropy provide insights into why we experience time as flowing in one direction, while quantum mechanics introduces additional complexities regarding the role of measurement and observation in temporal processes. These scientific discoveries have profound implications for our understanding of free will, determinism, and the nature of reality itself.",
    "The evolution of human societies from small hunter-gatherer groups to complex civilizations represents one of the most remarkable transformations in the history of life on Earth. This transition involved the development of agriculture, the establishment of permanent settlements, the emergence of social hierarchies, and the creation of complex institutions for governance, trade, and cultural transmission. The factors that drove these changes include environmental pressures, technological innovations, population growth, and the need for cooperation and coordination among increasingly large groups of individuals. Understanding these historical processes provides valuable insights into contemporary challenges related to social organization, economic inequality, environmental sustainability, and global cooperation.",
    "The intersection of genetics, environment, and behavior in shaping human development represents a complex web of interactions that scientists are still working to understand. Epigenetic mechanisms demonstrate how environmental factors can influence gene expression without changing the underlying DNA sequence, potentially affecting not only individual development but also inheritance patterns across generations. The nature versus nurture debate has evolved into a more nuanced understanding of how genetic predispositions interact with environmental influences, social contexts, and individual choices to shape personality, intelligence, health outcomes, and behavioral patterns. This knowledge has important implications for education, healthcare, social policy, and our understanding of human potential and responsibility.",
    "The future of human civilization depends on our ability to address unprecedented global challenges including climate change, resource depletion, technological disruption, and social inequality while maintaining democratic values, cultural diversity, and individual freedoms. The interconnected nature of these challenges requires unprecedented levels of international cooperation, innovative solutions that transcend traditional disciplinary boundaries, and new forms of governance that can effectively address problems that span multiple scales of space and time. The choices we make today regarding technology development, environmental protection, social justice, and global cooperation will determine whether future generations inherit a world of opportunity and prosperity or one marked by conflict, scarcity, and environmental degradation."
  ]
};

// Shuffle array function to randomize text selection
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Track used texts to avoid repetition
const usedTexts: { [key: string]: Set<number> } = {
  easy: new Set(),
  medium: new Set(),
  hard: new Set()
};

export function getRandomText(difficulty: string): string {
  const texts = typingTexts[difficulty as keyof typeof typingTexts] || typingTexts.medium;
  const usedSet = usedTexts[difficulty] || new Set();
  
  // If all texts have been used, reset the used set
  if (usedSet.size >= texts.length) {
    usedSet.clear();
  }
  
  // Find available texts
  const availableIndices = texts
    .map((_, index) => index)
    .filter(index => !usedSet.has(index));
  
  // Select random available text
  const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
  usedSet.add(randomIndex);
  
  return texts[randomIndex];
}

export function getDifficultyLevel(difficulty: string): DifficultyLevel {
  return difficultyLevels.find(level => level.id === difficulty) || difficultyLevels[1];
}

// Get a specific text for multiplayer (same text for all players)
export function getMultiplayerText(difficulty: string, seed?: string): string {
  const texts = typingTexts[difficulty as keyof typeof typingTexts] || typingTexts.medium;
  
  if (seed) {
    // Use seed to ensure same text for all players in a room
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    const index = Math.abs(hash) % texts.length;
    return texts[index];
  }
  
  return texts[Math.floor(Math.random() * texts.length)];
}