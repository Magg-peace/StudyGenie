import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Sparkles, 
  Heart, 
  Star, 
  Crown, 
  Zap, 
  Brain, 
  BookOpen,
  Mic,
  Volume2,
  MessageCircle,
  Wand2,
  Rocket,
  Lightbulb,
  Trophy
} from 'lucide-react';

interface AICharacterProps {
  gender: 'boy' | 'girl';
  mood: 'happy' | 'excited' | 'thinking' | 'celebrating' | 'encouraging' | 'magical';
  size: 'sm' | 'md' | 'lg' | 'xl';
  isAnimating?: boolean;
  isListening?: boolean;
  onInteract?: () => void;
  userName?: string;
  userAge?: number;
  language?: string;
}

interface CharacterResponse {
  text: string;
  emotion: string;
  audioUrl?: string;
}

export function EnhancedAICharacter({
  gender,
  mood,
  size,
  isAnimating = true,
  isListening = false,
  onInteract,
  userName = "friend",
  userAge = 16,
  language = 'en'
}: AICharacterProps) {
  const [currentMood, setCurrentMood] = useState(mood);
  const [isInteracting, setIsInteracting] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<CharacterResponse | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  // Character Personalities
  const boyCharacter = {
    name: "Alex",
    personality: "Smart, encouraging tech buddy",
    avatar: "🤖",
    colors: {
      primary: "var(--boy-primary)",
      secondary: "var(--boy-secondary)",
      accent: "var(--boy-accent)"
    },
    animations: "boy-tech",
    responses: {
      greeting: getLocalizedText(language, {
        en: `Hey ${userName}! Ready to learn something awesome today? 🚀`,
        hi: `हैलो ${userName}! आज कुछ शानदार सीखने के लिए तैयार हो? 🚀`,
        mr: `हाय ${userName}! आज काहीतरी छान शिकायला तयार आहात का? 🚀`
      }),
      encouraging: getLocalizedText(language, {
        en: "You're doing great! Let's tackle this together! 💪",
        hi: "तुम बहुत अच्छा कर रहे हो! चलो इसे मिलकर हल करते हैं! 💪",
        mr: "तुम्ही खूप चांगले करत आहात! चला हे एकत्र सोडवूया! 💪"
      }),
      celebration: getLocalizedText(language, {
        en: "Awesome work! You're becoming a learning champion! 🏆",
        hi: "शानदार काम! तुम एक सीखने के चैंपियन बन रहे हो! 🏆",
        mr: "छान काम! तुम्ही एक शिकण्याचे चॅम्पियन बनत आहात! 🏆"
      })
    }
  };

  const girlCharacter = {
    name: "Luna",
    personality: "Magical, wise princess mentor",
    avatar: "👸🏻",
    colors: {
      primary: "var(--girl-primary)",
      secondary: "var(--girl-secondary)",
      accent: "var(--girl-accent)"
    },
    animations: "princess-sparkle",
    responses: {
      greeting: getLocalizedText(language, {
        en: `Hello beautiful ${userName}! ✨ Ready for a magical learning adventure? 🌟`,
        hi: `हैलो सुंदर ${userName}! ✨ एक जादुई सीखने के साहसिक कार्य के लिए तैयार हो? 🌟`,
        mr: `हॅलो सुंदर ${userName}! ✨ एक जादुई शिकण्याच्या साहसासाठी तयार आहात का? 🌟`
      }),
      encouraging: getLocalizedText(language, {
        en: "You're sparkling with brilliance! Keep shining, darling! ✨💖",
        hi: "तुम प्रतिभा से चमक रहे हो! चमकते रहो, प्रिय! ✨💖",
        mr: "तुम्ही हुशारीने चमकत आहात! चमकत राहा, प्रिय! ✨💖"
      }),
      celebration: getLocalizedText(language, {
        en: "Magical! You're absolutely brilliant! Time to celebrate! 🎉✨👑",
        hi: "जादुई! तुम बिल्कुल शानदार हो! जश्न का समय! 🎉✨👑",
        mr: "जादुई! तुम्ही अगदी शानदार आहात! उत्सवाची वेळ! 🎉✨👑"
      })
    }
  };

  function getLocalizedText(lang: string, texts: Record<string, string>): string {
    return texts[lang] || texts.en;
  }

  const currentCharacter = gender === 'boy' ? boyCharacter : girlCharacter;

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-16 h-16 text-2xl';
      case 'md': return 'w-24 h-24 text-4xl';
      case 'lg': return 'w-32 h-32 text-6xl';
      case 'xl': return 'w-40 h-40 text-8xl';
      default: return 'w-24 h-24 text-4xl';
    }
  };

  const getMoodIcon = () => {
    switch (currentMood) {
      case 'happy': return gender === 'girl' ? <Heart className="h-4 w-4" /> : <Lightbulb className="h-4 w-4" />;
      case 'excited': return gender === 'girl' ? <Sparkles className="h-4 w-4" /> : <Rocket className="h-4 w-4" />;
      case 'thinking': return <Brain className="h-4 w-4" />;
      case 'celebrating': return gender === 'girl' ? <Crown className="h-4 w-4" /> : <Trophy className="h-4 w-4" />;
      case 'encouraging': return <Star className="h-4 w-4" />;
      case 'magical': return gender === 'girl' ? <Wand2 className="h-4 w-4" /> : <Zap className="h-4 w-4" />;
      default: return <Heart className="h-4 w-4" />;
    }
  };

  const handleInteraction = async () => {
    if (!onInteract) return;

    setIsInteracting(true);
    setCurrentMood('thinking');

    // Simulate AI processing
    setTimeout(() => {
      const responseKey = Math.random() > 0.5 ? 'encouraging' : 'celebration';
      const response = currentCharacter.responses[responseKey];
      
      setCurrentResponse({
        text: response,
        emotion: 'happy'
      });
      
      setCurrentMood('happy');
      setIsInteracting(false);
      
      onInteract();
    }, 1500);
  };

  const getAgeAppropriateGreeting = () => {
    if (userAge <= 12) {
      return gender === 'girl' 
        ? "Hello little princess! Ready for magical learning? ✨👑"
        : "Hey buddy! Let's explore and learn cool stuff! 🚀🎮";
    } else if (userAge <= 16) {
      return gender === 'girl'
        ? "Hi beautiful! Ready to shine in your studies? ✨💖"
        : "What's up! Ready to level up your knowledge? 💪🧠";
    } else {
      return gender === 'girl'
        ? "Hello dear! Let's make learning elegant and fun! 🌟📚"
        : "Hey there! Ready for some serious learning? 📖💡";
    }
  };

  return (
    <div className="relative inline-block">
      {/* Main Character */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ 
          scale: isVisible ? 1 : 0,
          rotate: 0,
          y: isAnimating ? [-5, 5] : 0
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          y: {
            duration: 2,
            repeat: isAnimating ? Infinity : 0,
            repeatType: "reverse",
            ease: "easeInOut"
          }
        }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        className={`
          ${getSizeClasses()}
          ${gender === 'girl' ? 'glass-girl' : 'glass-boy'}
          rounded-full flex items-center justify-center cursor-pointer
          relative overflow-hidden group
          ${currentMood === 'magical' && gender === 'girl' ? 'sparkle-bg' : ''}
          ${currentMood === 'excited' && gender === 'boy' ? 'boy-tech' : ''}
          ${isListening ? 'gentle-pulse' : ''}
        `}
        onClick={handleInteraction}
        style={{
          background: gender === 'girl' 
            ? 'linear-gradient(135deg, #fce7f3 0%, #fdf2f8 100%)'
            : 'linear-gradient(135deg, #ddd6fe 0%, #c7d2fe 100%)'
        }}
      >
        {/* Character Avatar */}
        <span className="relative z-10">{currentCharacter.avatar}</span>

        {/* Mood Indicator */}
        <div className={`
          absolute top-0 right-0 w-6 h-6 rounded-full flex items-center justify-center
          ${gender === 'girl' ? 'bg-pink-200' : 'bg-purple-200'}
          border-2 border-white shadow-md
        `}>
          {getMoodIcon()}
        </div>

        {/* Listening Indicator */}
        {isListening && (
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-blue-400"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}

        {/* Interaction Sparkles */}
        {isInteracting && (
          <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 text-yellow-400"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                initial={{ scale: 0, rotate: 0 }}
                animate={{ 
                  scale: [0, 1, 0], 
                  rotate: [0, 180, 360],
                  y: [0, -20, -40]
                }}
                transition={{ 
                  duration: 1.5, 
                  delay: i * 0.2,
                  ease: "easeOut"
                }}
              >
                ✨
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Character Info Card */}
      <AnimatePresence>
        {currentResponse && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 z-20"
          >
            <Card className={`
              ${gender === 'girl' ? 'glass-girl' : 'glass-boy'}
              max-w-xs hover-lift
            `}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm
                    ${gender === 'girl' ? 'bg-pink-100' : 'bg-purple-100'}
                  `}>
                    {currentCharacter.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{currentCharacter.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {currentCharacter.personality}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {currentResponse.text}
                    </p>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="text-xs">
                        <Volume2 className="h-3 w-3 mr-1" />
                        Play Audio
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Ask Question
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Elements for Girl Character */}
      {gender === 'girl' && isAnimating && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute text-pink-300"
              style={{
                top: `${20 + i * 30}%`,
                left: `${20 + i * 25}%`,
              }}
              animate={{
                y: [0, -10, 0],
                rotate: [0, 360],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      )}

      {/* Floating Elements for Boy Character */}
      {gender === 'boy' && isAnimating && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`tech-${i}`}
              className="absolute text-blue-400"
              style={{
                top: `${30 + i * 20}%`,
                right: `${10 + i * 15}%`,
              }}
              animate={{
                x: [0, 5, 0],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            >
              {['⚡', '🔬', '💻'][i]}
            </motion.div>
          ))}
        </div>
      )}

      {/* Voice Interaction Hint */}
      {onInteract && (
        <motion.div
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 3 }}
        >
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Mic className="h-3 w-3" />
            <span>Click to chat</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Age-based character selection helper
export function getCharacterForUser(userAge?: number, userGender?: 'boy' | 'girl') {
  // Default character selection logic
  if (!userGender) {
    return userAge && userAge <= 14 ? 'girl' : 'boy';
  }
  return userGender;
}

// Character response generator
export function generateCharacterResponse(
  input: string, 
  context: any, 
  character: 'boy' | 'girl',
  language: string = 'en'
): CharacterResponse {
  // This would integrate with your AI backend
  const responses = {
    boy: {
      en: "Great question! Let me help you figure this out step by step. 🚀",
      hi: "बेहतरीन सवाल! मैं तुम्हें इसे कदम दर कदम समझने में मदद करूंगा। 🚀",
      mr: "छान प्रश्न! मी तुम्हाला हे पायरी पायरीने समजून घेण्यास मदत करेन। 🚀"
    },
    girl: {
      en: "What a wonderful question, darling! ✨ Let's discover the answer together! 💖",
      hi: "कितना अद्भुत सवाल है, प्रिय! ✨ चलो मिलकर जवाब खोजते हैं! 💖",
      mr: "किती अद्भुत प्रश्न आहे, प्रिय! ✨ चला एकत्र उत्तर शोधूया! 💖"
    }
  };
  
  return {
    text: responses[character][language] || responses[character].en,
    emotion: 'encouraging'
  };
}