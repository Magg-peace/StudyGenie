import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { MessageCircle, Send, Bot, User, Globe, Lightbulb, Mic, Volume2, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import { RobotCharacter, ThinkingRobot } from './RobotCharacter';

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  language: string;
  translated?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  confidence?: number;
}

interface TutorResponse {
  answer: string;
  relatedConcepts: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  examples?: string[];
  keyTerms?: { term: string; definition: string }[];
}

export function EnhancedAITutor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'ai',
      content: "नमस्ते! मैं आपका AI भौतिकी शिक्षक हूं। मैं कई भाषाओं में अवधारणाओं की व्याख्या, समस्याओं का समाधान और प्रश्नों के उत्तर दे सकता हूं। आज आप क्या सीखना चाहते हैं?",
      timestamp: new Date(),
      language: 'hi',
      sentiment: 'positive'
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('hi');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [robotMood, setRobotMood] = useState<'happy' | 'thinking' | 'excited' | 'sleeping' | 'confused'>('happy');
  const [showRobot, setShowRobot] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸', greeting: "Hello! I'm your AI physics tutor." },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', greeting: "नमस्ते! मैं आपका AI भौतिकी शिक्षक हूं।" },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳', greeting: "नमस्कार! मी तुमचा AI भौतिकशास्त्र शिक्षक आहे।" },
    { code: 'es', name: 'Español', flag: '🇪🇸', greeting: "¡Hola! Soy tu tutor de física con IA." },
    { code: 'fr', name: 'Français', flag: '🇫🇷', greeting: "Bonjour! Je suis votre tuteur de physique IA." },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', greeting: "Hallo! Ich bin dein KI-Physik-Tutor." },
    { code: 'zh', name: '中文', flag: '🇨🇳', greeting: "你好！我是你的AI物理导师。" },
    { code: 'ja', name: '日本語', flag: '🇯🇵', greeting: "こんにちは！私はあなたのAI物理学チューターです。" },
    { code: 'ko', name: '한국어', flag: '🇰🇷', greeting: "안녕하세요! 저는 당신의 AI 물리학 튜터입니다." }
  ];

  const sampleResponses: { [key: string]: TutorResponse } = {
    'electromagnetic waves': {
      answer: "Electromagnetic waves are waves consisting of oscillating electric and magnetic fields that are perpendicular to each other and to the direction of propagation. They travel at the speed of light (c = 3×10⁸ m/s) in vacuum and don't require a medium to propagate.",
      relatedConcepts: ['Electric fields', 'Magnetic fields', 'Wave properties', 'Speed of light'],
      difficulty: 'intermediate',
      examples: ['Radio waves for communication', 'Visible light from the sun', 'X-rays for medical imaging'],
      keyTerms: [
        { term: 'Frequency', definition: 'Number of wave cycles per second (Hz)' },
        { term: 'Wavelength', definition: 'Distance between two consecutive wave peaks' }
      ]
    },
    'विद्युत चुम्बकीय तरंगें': {
      answer: "विद्युत चुम्बकीय तरंगें वे तरंगें हैं जिनमें दोलायमान विद्युत और चुम्बकीय क्षेत्र होते हैं जो एक दूसरे के लंबवत और तरंग की दिशा के लंबवत होते हैं। ये निर्वात में प्रकाश की गति (c = 3×10⁸ m/s) से चलती हैं।",
      relatedConcepts: ['विद्युत क्षेत्र', 'चुम्बकीय क्षेत्र', 'तरंग गुण', 'प्रकाश की गति'],
      difficulty: 'intermediate',
      examples: ['संचार के लिए रेडियो तरंगें', 'सूर्य से दृश्य प्रकाश', 'चिकित्सा इमेजिंग के लिए X-किरणें'],
      keyTerms: [
        { term: 'आवृत्ति', definition: 'प्रति सेकंड तरंग चक्रों की संख्या (Hz)' },
        { term: 'तरंग दैर्घ्य', definition: 'दो क्रमागत तरंग शिखरों के बीच की दूरी' }
      ]
    }
  };

  const multilingualResponses = {
    'en': {
      thinking: "Let me think about that...",
      processing: "Processing your question...",
      understood: "I understand! Let me explain...",
      confused: "Could you clarify that question?",
      excited: "Great question! This is fascinating!"
    },
    'hi': {
      thinking: "मुझे इसके बारे में सोचने दीजिए...",
      processing: "आपके प्रश्न को संसाधित कर रहा हूं...",
      understood: "मैं समझ गया! मैं समझाता हूं...",
      confused: "क्या आप उस प्रश्न को स्पष्ट कर सकते हैं?",
      excited: "बहुत अच्छा प्रश्न! यह दिलचस्प है!"
    },
    'mr': {
      thinking: "मला याचा विचार करू द्या...",
      processing: "तुमचा प्रश्न प्रक्रिया करत आहे...",
      understood: "मला समजले! मी समजावतो...",
      confused: "तुम्ही तो प्रश्न स्पष्ट करू शकता का?",
      excited: "उत्तम प्रश्न! हे मनोरंजक आहे!"
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isTyping) {
      setRobotMood('thinking');
      setShowRobot(true);
    } else {
      setRobotMood('happy');
    }
  }, [isTyping]);

  const translateText = (text: string, fromLang: string, toLang: string): string => {
    // Enhanced translation simulation with more comprehensive mappings
    const translations: { [key: string]: { [key: string]: string } } = {
      'hi-en': {
        'विद्युत चुम्बकीय तरंगें': 'electromagnetic waves',
        'प्रकाश की गति': 'speed of light',
        'फोटॉन ऊर्जा': 'photon energy',
        'आवृत्ति': 'frequency',
        'तरंग दैर्घ्य': 'wavelength'
      },
      'en-hi': {
        'electromagnetic waves': 'विद्युत चुम्बकीय तरंगें',
        'speed of light': 'प्रकाश की गति',
        'photon energy': 'फोटॉन ऊर्जा',
        'frequency': 'आवृत्ति',
        'wavelength': 'तरंग दैर्घ्य'
      },
      'mr-en': {
        'विद्युत चुंबकीय लहरी': 'electromagnetic waves',
        'प्रकाशाचा वेग': 'speed of light'
      }
    };

    const key = `${fromLang}-${toLang}`;
    if (translations[key]) {
      let translated = text;
      Object.entries(translations[key]).forEach(([from, to]) => {
        translated = translated.replace(new RegExp(from, 'gi'), to);
      });
      return translated;
    }
    return text;
  };

  const analyzeMessage = (message: string): { sentiment: 'positive' | 'neutral' | 'negative', confidence: number } => {
    const positiveWords = ['good', 'great', 'excellent', 'wonderful', 'amazing', 'thanks', 'अच्छा', 'बढ़िया', 'धन्यवाद'];
    const negativeWords = ['bad', 'wrong', 'confused', 'difficult', 'hard', 'गलत', 'कठिन', 'मुश्किल'];
    
    const words = message.toLowerCase().split(' ');
    let positiveCount = 0;
    let negativeCount = 0;
    
    words.forEach(word => {
      if (positiveWords.some(pw => word.includes(pw))) positiveCount++;
      if (negativeWords.some(nw => word.includes(nw))) negativeCount++;
    });
    
    if (positiveCount > negativeCount) return { sentiment: 'positive', confidence: 0.8 };
    if (negativeCount > positiveCount) return { sentiment: 'negative', confidence: 0.7 };
    return { sentiment: 'neutral', confidence: 0.6 };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const analysis = analyzeMessage(inputMessage);
    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      language: selectedLanguage,
      sentiment: analysis.sentiment,
      confidence: analysis.confidence
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    // Robot reactions based on message sentiment
    if (analysis.sentiment === 'positive') setRobotMood('excited');
    else if (analysis.sentiment === 'negative') setRobotMood('confused');
    else setRobotMood('thinking');

    // Simulate AI processing time
    setTimeout(() => {
      const query = inputMessage.toLowerCase();
      const translatedQuery = translateText(query, selectedLanguage, 'en');
      
      let response: TutorResponse;
      const matchedKey = Object.keys(sampleResponses).find(key => 
        query.includes(key) || translatedQuery.includes(key) || query.includes(key.replace(/\s+/g, ''))
      );

      if (matchedKey) {
        response = sampleResponses[matchedKey];
      } else {
        const currentLangResponses = multilingualResponses[selectedLanguage as keyof typeof multilingualResponses] || multilingualResponses['en'];
        response = {
          answer: currentLangResponses.understood + " " + getDefaultResponse(selectedLanguage),
          relatedConcepts: ['Physics concepts', 'Mathematical formulas', 'Problem solving'],
          difficulty: 'beginner',
          examples: ['Ask about electromagnetic waves', 'Inquire about quantum mechanics', 'Request problem solutions'],
          keyTerms: [{ term: 'Physics', definition: 'The study of matter, energy, and their interactions' }]
        };
      }

      const aiMessage: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: response.answer,
        timestamp: new Date(),
        language: selectedLanguage,
        sentiment: 'positive',
        confidence: 0.9
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      setRobotMood('happy');
    }, 1500 + Math.random() * 1000);
  };

  const getDefaultResponse = (lang: string): string => {
    const defaults = {
      'en': "I understand you're asking about physics concepts. Could you please be more specific?",
      'hi': "मैं समझता हूं कि आप भौतिकी की अवधारणाओं के बारे में पूछ रहे हैं। कृपया और स्पष्ट हो सकते हैं?",
      'mr': "तुम्ही भौतिकशास्त्राच्या संकल्पनांबद्दल विचारत आहात हे मला समजले. कृपया अधिक स्पष्ट करू शकता?",
      'es': "Entiendo que preguntas sobre conceptos de física. ¿Podrías ser más específico?",
      'fr': "Je comprends que vous posez des questions sur les concepts de physique. Pourriez-vous être plus précis?",
      'de': "Ich verstehe, dass Sie nach Physikkonzepten fragen. Könnten Sie spezifischer sein?",
      'zh': "我理解你在询问物理概念。你能更具体一些吗？",
      'ja': "物理の概念について質問していることは理解しています。もう少し具体的にしていただけますか？",
      'ko': "물리학 개념에 대해 질문하고 있다는 것을 이해합니다. 좀 더 구체적으로 말씀해 주시겠습니까?"
    };
    return defaults[lang as keyof typeof defaults] || defaults['en'];
  };

  const handleLanguageChange = (newLang: string) => {
    setSelectedLanguage(newLang);
    const currentLang = languages.find(l => l.code === newLang);
    if (currentLang) {
      const greetingMessage: Message = {
        id: messages.length + 1,
        type: 'ai',
        content: currentLang.greeting,
        timestamp: new Date(),
        language: newLang,
        sentiment: 'positive'
      };
      setMessages(prev => [...prev, greetingMessage]);
      setRobotMood('excited');
      setTimeout(() => setRobotMood('happy'), 2000);
    }
  };

  const startVoiceInput = () => {
    setIsListening(true);
    setRobotMood('thinking');
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false);
      setRobotMood('happy');
      setInputMessage("What is electromagnetic radiation?");
    }, 3000);
  };

  const speakMessage = (text: string) => {
    setRobotMood('excited');
    // Simulate text-to-speech
    setTimeout(() => setRobotMood('happy'), 2000);
  };

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    setRobotMood('excited');
    setTimeout(() => setRobotMood('happy'), 1000);
  };

  const quickQuestions = {
    'en': ["Explain electromagnetic waves", "What is the speed of light?", "How do you calculate photon energy?"],
    'hi': ["विद्युत चुम्बकीय तरंगों की व्याख्या करें", "प्रकाश की गति क्या है?", "फोटॉन ऊर्जा की गणना कैसे करते हैं?"],
    'mr': ["विद्युत चुंबकीय लहरींचे स्पष्टीकरण द्या", "प्रकाशाचा वेग काय आहे?", "फोटॉन ऊर्जेची गणना कशी करावी?"]
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-4">
      {/* Robot Character Display */}
      <AnimatePresence>
        {showRobot && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="flex justify-center"
          >
            <Card className="glass w-fit p-4">
              <CardContent className="p-0">
                {isTyping ? (
                  <ThinkingRobot />
                ) : (
                  <RobotCharacter 
                    mood={robotMood} 
                    size="lg" 
                    isAnimating={true}
                    message={multilingualResponses[selectedLanguage as keyof typeof multilingualResponses]?.thinking || "How can I help you?"}
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Language Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Globe className="h-5 w-5 text-blue-500" />
              <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-64 glass">
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
              <Badge variant="secondary" className="rainbow-bg text-white">
                AI-Powered Multilingual
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Chat Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="h-[600px] flex flex-col glass">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 gradient-text">
              <MessageCircle className="h-5 w-5" />
              Enhanced AI Physics Tutor
              <Badge variant="outline" className="ml-auto glow-animation">
                🤖 RAG + Vector DB + OCR
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
            {/* Messages */}
            <ScrollArea className="flex-1 pr-4">
              <AnimatePresence>
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.type === 'ai' && (
                        <motion.div 
                          className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0"
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Bot className="h-5 w-5 text-white" />
                        </motion.div>
                      )}
                      
                      <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : ''}`}>
                        <motion.div
                          className={`p-4 rounded-2xl relative ${
                            message.type === 'user'
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                              : 'glass border'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          layout
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          
                          {/* Message actions */}
                          <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => speakMessage(message.content)}
                              className="h-6 w-6 p-0"
                            >
                              <Volume2 className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyMessage(message.content)}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            {message.type === 'ai' && (
                              <>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                  <ThumbsUp className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                  <ThumbsDown className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                          
                          {/* Sentiment indicator */}
                          {message.sentiment && (
                            <div className="absolute -top-1 -right-1">
                              <div className={`w-3 h-3 rounded-full ${
                                message.sentiment === 'positive' ? 'bg-green-400' :
                                message.sentiment === 'negative' ? 'bg-red-400' : 'bg-yellow-400'
                              }`} />
                            </div>
                          )}
                        </motion.div>
                        
                        <div className="flex items-center gap-2 mt-1 px-1">
                          <p className="text-xs text-muted-foreground">
                            {formatTime(message.timestamp)}
                          </p>
                          {message.confidence && (
                            <Badge variant="outline" className="text-xs">
                              {Math.round(message.confidence * 100)}% confident
                            </Badge>
                          )}
                        </div>
                      </div>

                      {message.type === 'user' && (
                        <motion.div 
                          className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center flex-shrink-0 order-3"
                          whileHover={{ scale: 1.1, rotate: -10 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <User className="h-5 w-5 text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 justify-start"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      <div className="glass border p-4 rounded-2xl">
                        <div className="flex gap-1">
                          <motion.div 
                            className="w-2 h-2 bg-blue-500 rounded-full"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          />
                          <motion.div 
                            className="w-2 h-2 bg-purple-500 rounded-full"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          />
                          <motion.div 
                            className="w-2 h-2 bg-pink-500 rounded-full"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </AnimatePresence>
            </ScrollArea>

            {/* Quick Questions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lightbulb className="h-4 w-4" />
                <span>Quick questions:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(quickQuestions[selectedLanguage as keyof typeof quickQuestions] || quickQuestions['en']).map((question, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInputMessage(question)}
                      className="text-xs glass hover-lift"
                    >
                      {question}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Input Area */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2"
            >
              <div className="flex-1 relative">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                  placeholder={`Ask me anything about physics in ${languages.find(l => l.code === selectedLanguage)?.name}...`}
                  className="glass pr-20"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={startVoiceInput}
                      disabled={isListening}
                      className="h-8 w-8 p-0"
                    >
                      <Mic className={`h-4 w-4 ${isListening ? 'text-red-500 animate-pulse' : ''}`} />
                    </Button>
                  </motion.div>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!inputMessage.trim() || isTyping}
                  className="rainbow-bg text-white hover-lift"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}