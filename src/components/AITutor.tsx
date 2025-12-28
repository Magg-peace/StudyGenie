import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { MessageCircle, Send, Bot, User, Globe, Lightbulb } from 'lucide-react';

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  language: string;
}

interface TutorResponse {
  answer: string;
  relatedConcepts: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export function AITutor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your AI physics tutor. I can help explain concepts, solve problems, and answer questions in multiple languages. What would you like to learn about today?",
      timestamp: new Date(),
      language: 'en'
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isTyping, setIsTyping] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' }
  ];

  const sampleResponses: { [key: string]: TutorResponse } = {
    'electromagnetic waves': {
      answer: "Electromagnetic waves are waves consisting of oscillating electric and magnetic fields that are perpendicular to each other and to the direction of propagation. They travel at the speed of light (c = 3×10⁸ m/s) in vacuum and don't require a medium to propagate. The electromagnetic spectrum includes radio waves, microwaves, infrared, visible light, ultraviolet, X-rays, and gamma rays.",
      relatedConcepts: ['Electric fields', 'Magnetic fields', 'Wave properties', 'Speed of light'],
      difficulty: 'intermediate'
    },
    'speed of light': {
      answer: "The speed of light in vacuum is a fundamental physical constant denoted by 'c' and equals approximately 299,792,458 meters per second (often rounded to 3×10⁸ m/s). This speed is the maximum at which all energy, matter, and information can travel. Light slows down when traveling through materials with refractive indices greater than 1.",
      relatedConcepts: ['Electromagnetic waves', 'Refractive index', 'Special relativity'],
      difficulty: 'beginner'
    },
    'photon energy': {
      answer: "The energy of a photon is given by Planck's equation: E = hf, where h is Planck's constant (6.626×10⁻³⁴ J·s) and f is the frequency. This equation shows that photon energy is directly proportional to frequency. Higher frequency light (like blue or violet) carries more energy per photon than lower frequency light (like red).",
      relatedConcepts: ['Planck constant', 'Frequency', 'Quantum mechanics', 'Photoelectric effect'],
      difficulty: 'intermediate'
    }
  };

  const translateResponse = (text: string, language: string): string => {
    // Simulate translation for different languages
    const translations: { [key: string]: { [key: string]: string } } = {
      'es': {
        "Hello! I'm your AI physics tutor": "¡Hola! Soy tu tutor de física con IA",
        "electromagnetic waves": "ondas electromagnéticas",
        "speed of light": "velocidad de la luz"
      },
      'fr': {
        "Hello! I'm your AI physics tutor": "Bonjour! Je suis votre tuteur de physique IA",
        "electromagnetic waves": "ondes électromagnétiques", 
        "speed of light": "vitesse de la lumière"
      },
      'zh': {
        "Hello! I'm your AI physics tutor": "你好！我是你的AI物理导师",
        "electromagnetic waves": "电磁波",
        "speed of light": "光速"
      }
    };

    if (language === 'en') return text;
    
    // Simple translation simulation
    let translated = text;
    if (translations[language]) {
      Object.entries(translations[language]).forEach(([en, foreign]) => {
        translated = translated.replace(new RegExp(en, 'gi'), foreign);
      });
    }
    
    return translated;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      language: selectedLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const query = inputMessage.toLowerCase();
      let response: TutorResponse;

      // Find matching response or provide default
      const matchedKey = Object.keys(sampleResponses).find(key => 
        query.includes(key) || query.includes(key.replace(/\s+/g, ''))
      );

      if (matchedKey) {
        response = sampleResponses[matchedKey];
      } else {
        response = {
          answer: "I understand you're asking about physics concepts. Could you please be more specific? I can help with topics like electromagnetic waves, quantum mechanics, thermodynamics, mechanics, and more. Feel free to ask about specific formulas, concepts, or problems you'd like me to explain.",
          relatedConcepts: ['Ask about specific topics', 'Try example questions', 'Request problem solving'],
          difficulty: 'beginner'
        };
      }

      const translatedAnswer = translateResponse(response.answer, selectedLanguage);

      const aiMessage: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: translatedAnswer,
        timestamp: new Date(),
        language: selectedLanguage
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "Explain electromagnetic waves",
    "What is the speed of light?", 
    "How do you calculate photon energy?",
    "Difference between frequency and wavelength?"
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-4">
      {/* Language Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Globe className="h-5 w-5" />
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="h-[500px] flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            AI Physics Tutor
            <Badge variant="outline" className="ml-auto">
              Interactive & Multilingual
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* Messages */}
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : ''}`}>
                    <div
                      className={`p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 px-1">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>

                  {message.type === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 order-3">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Questions */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lightbulb className="h-4 w-4" />
              <span>Quick questions:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage(question)}
                  className="text-xs"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask me anything about physics... (${languages.find(l => l.code === selectedLanguage)?.name})`}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}