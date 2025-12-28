import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Send, 
  Mic, 
  Volume2, 
  BookOpen, 
  Brain, 
  Heart,
  Star,
  Lightbulb,
  FileText,
  Quote,
  Play,
  Pause,
  RotateCcw,
  Languages,
  Sparkles,
  Trophy,
  Target,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Smile
} from 'lucide-react';
import { EnhancedAICharacter } from './EnhancedAICharacter';

interface ConceptNode {
  id: string;
  name: string;
  mastery: number;
  sourcePages: number[];
  relatedConcepts: string[];
}

interface Citation {
  pageNumber: number;
  paragraph: number;
  text: string;
  confidence: number;
}

interface AIResponse {
  text: string;
  citations: Citation[];
  conceptsReferenced: string[];
  language: string;
  audioUrl?: string;
  emotion: 'encouraging' | 'celebrating' | 'gentle' | 'excited' | 'supportive';
  performanceFeedback?: {
    score: number;
    strengths: string[];
    improvements: string[];
    nextSteps: string[];
  };
}

interface UploadedDocument {
  id: string;
  name: string;
  pages: number;
  concepts: ConceptNode[];
  summary: string;
  language: string;
}

export function PDFPoweredAITutor({ userProfile }: { userProfile: any }) {
  const [messages, setMessages] = useState<Array<{
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
    citations?: Citation[];
    emotion?: string;
  }>>([]);
  
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(userProfile?.language || 'en');
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([
    {
      id: 'doc-1',
      name: 'Physics Concepts.pdf',
      pages: 45,
      concepts: [
        { id: 'waves', name: 'Wave Mechanics', mastery: 75, sourcePages: [12, 15, 23], relatedConcepts: ['frequency', 'amplitude'] },
        { id: 'quantum', name: 'Quantum Physics', mastery: 45, sourcePages: [30, 35, 40], relatedConcepts: ['waves', 'energy'] }
      ],
      summary: 'Comprehensive guide to fundamental physics concepts including wave mechanics and quantum theory.',
      language: 'en'
    }
  ]);
  
  const [currentCharacterMood, setCurrentCharacterMood] = useState<'happy' | 'excited' | 'thinking' | 'celebrating' | 'encouraging' | 'magical'>('happy');
  const [showCitations, setShowCitations] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇮🇳' },
    { code: 'or', name: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Add welcome message based on user age and language
    const welcomeMessage = getWelcomeMessage();
    setMessages([{
      id: 'welcome',
      type: 'ai',
      content: welcomeMessage,
      timestamp: new Date(),
      emotion: 'excited'
    }]);
  }, [userProfile, selectedLanguage]);

  const getWelcomeMessage = () => {
    const userName = userProfile?.name || 'friend';
    const age = userProfile?.age || 16;
    
    const messages = {
      en: {
        young: `Hello ${userName}! I'm your magical learning companion! ✨ I've read all your study materials and I'm here to help you learn in the most fun way possible! What would you like to explore today?`,
        teen: `Hey ${userName}! Ready to dive deep into your studies? I've analyzed your uploaded notes and I'm here to help you master every concept. What topic should we tackle first?`,
        adult: `Welcome ${userName}! I'm your AI study assistant. I've processed your documents and built a comprehensive knowledge graph. How can I help you achieve your learning goals today?`
      },
      hi: {
        young: `नमस्ते ${userName}! मैं आपका जादुई सीखने का साथी हूँ! ✨ मैंने आपकी सभी पढ़ाई की सामग्री पढ़ी है और मैं आपकी मदद करने के लिए यहाँ हूँ!`,
        teen: `हाय ${userName}! अपनी पढ़ाई में गहराई से जाने के लिए तैयार हो? मैंने आपके नोट्स का विश्लेषण किया है और हर अवधारणा में महारत पाने में आपकी मदद करने के लिए यहाँ हूँ।`,
        adult: `स्वागत है ${userName}! मैं आपका AI अध्ययन सहायक हूँ। मैंने आपके दस्तावेजों को संसाधित किया है और एक व्यापक ज्ञान ग्राफ बनाया है।`
      },
      mr: {
        young: `नमस्कार ${userName}! मी तुमचा जादुई शिकण्याचा साथी आहे! ✨ मी तुमची सर्व अभ्यास सामग्री वाचली आहे आणि तुम्हाला मदत करण्यासाठी इथे आहे!`,
        teen: `हाय ${userName}! तुमच्या अभ्यासात खोलवर जाण्यासाठी तयार आहात का? मी तुमच्या नोट्सचे विश्लेषण केले आहे आणि प्रत्येक संकल्पनेमध्ये प्रभुत्व मिळवण्यासाठी येथे आहे।`,
        adult: `स्वागत आहे ${userName}! मी तुमचा AI अभ्यास सहाय्यक आहे। मी तुमची कागदपत्रे प्रक्रिया केली आहेत आणि एक व्यापक ज्ञान आलेख तयार केला आहे।`
      }
    };
    
    const langMessages = messages[selectedLanguage as keyof typeof messages] || messages.en;
    if (age <= 12) return langMessages.young;
    if (age <= 18) return langMessages.teen;
    return langMessages.adult;
  };

  const generateHumanizedResponse = async (userInput: string): Promise<AIResponse> => {
    // Simulate AI processing with concept graph integration
    setCurrentCharacterMood('thinking');
    
    // Mock concept analysis and citation generation
    const conceptsFound = uploadedDocuments[0].concepts.filter(concept => 
      userInput.toLowerCase().includes(concept.name.toLowerCase())
    );
    
    const citations: Citation[] = conceptsFound.length > 0 ? [
      {
        pageNumber: conceptsFound[0].sourcePages[0],
        paragraph: 2,
        text: "According to the fundamental principles outlined in your study material...",
        confidence: 0.95
      }
    ] : [];

    // Generate performance-based feedback
    const averageMastery = conceptsFound.reduce((sum, concept) => sum + concept.mastery, 0) / (conceptsFound.length || 1);
    
    let emotion: AIResponse['emotion'] = 'encouraging';
    let responseText = '';
    
    // Humanized response based on performance and age
    if (averageMastery >= 80) {
      emotion = 'celebrating';
      responseText = getLocalizedResponse('excellent', userInput, conceptsFound);
    } else if (averageMastery >= 60) {
      emotion = 'encouraging';
      responseText = getLocalizedResponse('good', userInput, conceptsFound);
    } else if (averageMastery >= 40) {
      emotion = 'supportive';
      responseText = getLocalizedResponse('needs_work', userInput, conceptsFound);
    } else {
      emotion = 'gentle';
      responseText = getLocalizedResponse('gentle_guidance', userInput, conceptsFound);
    }

    return {
      text: responseText,
      citations,
      conceptsReferenced: conceptsFound.map(c => c.id),
      language: selectedLanguage,
      emotion,
      performanceFeedback: {
        score: averageMastery,
        strengths: conceptsFound.filter(c => c.mastery >= 70).map(c => c.name),
        improvements: conceptsFound.filter(c => c.mastery < 70).map(c => c.name),
        nextSteps: [`Review ${conceptsFound[0]?.name || 'the topic'} fundamentals`, 'Practice with examples', 'Take a quiz to test understanding']
      }
    };
  };

  const getLocalizedResponse = (level: string, input: string, concepts: ConceptNode[]) => {
    const userName = userProfile?.name || 'dear';
    const isGirl = userProfile?.gender === 'girl' || userProfile?.age <= 14;
    
    const responses = {
      excellent: {
        en: isGirl 
          ? `Absolutely brilliant, ${userName}! ✨ You're sparkling with understanding! Your grasp of ${concepts[0]?.name || 'this concept'} is truly magical. Keep shining! 🌟💖`
          : `Outstanding work, ${userName}! 🚀 You've really mastered ${concepts[0]?.name || 'this concept'}. Your analytical thinking is impressive! Let's tackle the next challenge! 💪`,
        hi: isGirl
          ? `बिल्कुल शानदार, ${userName}! ✨ तुम समझ के साथ चमक रहे हो! ${concepts[0]?.name || 'इस अवधारणा'} की तुम्हारी समझ वास्तव में जादुई है। चमकते रहो! 🌟💖`
          : `उत्कृष्ट काम, ${userName}! 🚀 तुमने वास्तव में ${concepts[0]?.name || 'इस अवधारणा'} में महारत हासिल कर ली है। तुम्हारी विश्लेषणात्मक सोच प्रभावशाली है!`
      },
      good: {
        en: isGirl
          ? `Beautiful progress, ${userName}! 💖 You're doing so well with ${concepts[0]?.name || 'this topic'}. With a little more practice, you'll be absolutely brilliant! ✨`
          : `Great job, ${userName}! 👍 You've got a solid understanding of ${concepts[0]?.name || 'this concept'}. Let's strengthen it with some practice problems!`,
        hi: isGirl
          ? `सुंदर प्रगति, ${userName}! 💖 तुम ${concepts[0]?.name || 'इस विषय'} के साथ बहुत अच्छा कर रहे हो। थोड़े और अभ्यास के साथ, तुम बिल्कुल शानदार होगे! ✨`
          : `बेहतरीन काम, ${userName}! 👍 तुम्हारी ${concepts[0]?.name || 'इस अवधारणा'} की ठोस समझ है। चलो इसे कुछ अभ्यास समस्याओं के साथ मजबूत करते हैं!`
      },
      needs_work: {
        en: isGirl
          ? `Don't worry, sweet ${userName}! 🌸 Learning ${concepts[0]?.name || 'this concept'} takes time, and you're on the right path. Let's break it down into smaller, magical steps! ✨💕`
          : `No worries, ${userName}! 😊 ${concepts[0]?.name || 'This concept'} can be tricky, but I believe in you! Let's approach it step by step and build your confidence.`,
        hi: isGirl
          ? `चिंता मत करो, प्यारी ${userName}! 🌸 ${concepts[0]?.name || 'इस अवधारणा'} को सीखने में समय लगता है, और तुम सही रास्ते पर हो। चलो इसे छोटे, जादुई कदमों में तोड़ते हैं! ✨💕`
          : `कोई चिंता नहीं, ${userName}! 😊 ${concepts[0]?.name || 'यह अवधारणा'} मुश्किल हो सकती है, लेकिन मुझे तुम पर भरोसा है! चलो इसे कदम दर कदम समझते हैं।`
      },
      gentle_guidance: {
        en: isGirl
          ? `It's okay, precious ${userName}! 💕 Every brilliant mind starts somewhere. ${concepts[0]?.name || 'This topic'} might seem challenging now, but together we'll make it feel like magic! Let's start with the basics. 🌟`
          : `Hey buddy ${userName}! 😊 Everyone learns at their own pace, and that's perfectly fine! Let's explore ${concepts[0]?.name || 'this topic'} together, starting with the fundamentals. You've got this! 💪`,
        hi: isGirl
          ? `कोई बात नहीं, कीमती ${userName}! 💕 हर शानदार दिमाग कहीं न कहीं से शुरुआत करता है। ${concepts[0]?.name || 'यह विषय'} अभी चुनौतीपूर्ण लग सकता है, लेकिन मिलकर हम इसे जादू जैसा बनाएंगे!`
          : `अरे दोस्त ${userName}! 😊 हर कोई अपनी गति से सीखता है, और यह बिल्कुल ठीक है! चलो ${concepts[0]?.name || 'इस विषय'} को मिलकर समझते हैं।`
      }
    };
    
    const langResponses = responses[level as keyof typeof responses];
    return langResponses[selectedLanguage as keyof typeof langResponses] || langResponses.en;
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: currentInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsLoading(true);

    try {
      const response = await generateHumanizedResponse(currentInput);
      setCurrentCharacterMood(response.emotion as any);

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        content: response.text,
        timestamp: new Date(),
        citations: response.citations,
        emotion: response.emotion
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Implement speech recognition
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'celebrating': return 'text-green-600 bg-green-50';
      case 'encouraging': return 'text-blue-600 bg-blue-50';
      case 'supportive': return 'text-purple-600 bg-purple-50';
      case 'gentle': return 'text-pink-600 bg-pink-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Character Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center"
      >
        <EnhancedAICharacter
          gender={userProfile?.gender || (userProfile?.age <= 14 ? 'girl' : 'boy')}
          mood={currentCharacterMood}
          size="lg"
          isAnimating={true}
          isListening={isListening}
          userName={userProfile?.name}
          userAge={userProfile?.age}
          language={selectedLanguage}
        />
      </motion.div>

      {/* Main Interface */}
      <Card className="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              AI Study Companion
              <Badge variant="secondary" className="ml-2">
                PDF-Powered RAG
              </Badge>
            </CardTitle>
            
            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="text-sm border rounded px-2 py-1 bg-background"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="space-y-4">
              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto space-y-4 p-4 border rounded-lg bg-background/50">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`
                        max-w-[80%] p-3 rounded-lg
                        ${message.type === 'user' 
                          ? 'bg-primary text-primary-foreground ml-4' 
                          : `glass ${message.emotion ? getEmotionColor(message.emotion) : ''} mr-4`
                        }
                      `}>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        
                        {/* Citations */}
                        {message.citations && message.citations.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-border/50">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowCitations(!showCitations)}
                              className="text-xs"
                            >
                              <Quote className="h-3 w-3 mr-1" />
                              View Sources ({message.citations.length})
                            </Button>
                            
                            {showCitations && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-2 space-y-1"
                              >
                                {message.citations.map((citation, index) => (
                                  <div key={index} className="text-xs p-2 bg-background/80 rounded border">
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium">Page {citation.pageNumber}, ¶{citation.paragraph}</span>
                                      <Badge variant="outline" className="text-xs">
                                        {Math.round(citation.confidence * 100)}% confident
                                      </Badge>
                                    </div>
                                    <p className="mt-1 text-muted-foreground">{citation.text}</p>
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                          <span>{message.timestamp.toLocaleTimeString()}</span>
                          {message.type === 'ai' && (
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Volume2 className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Heart className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="glass max-w-[80%] p-3 rounded-lg mr-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                        <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                        <span>Thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask me anything about your study materials..."
                    className="pr-12"
                    disabled={isLoading}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleVoiceInput}
                    className={`absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 ${isListening ? 'text-red-500' : ''}`}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!currentInput.trim() || isLoading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <div className="grid gap-4">
                {uploadedDocuments.map((doc) => (
                  <Card key={doc.id} className="glass hover-lift">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h4 className="font-medium flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            {doc.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">{doc.summary}</p>
                          <div className="flex gap-2">
                            <Badge variant="outline">{doc.pages} pages</Badge>
                            <Badge variant="outline">{doc.concepts.length} concepts</Badge>
                            <Badge variant="outline">{doc.language.toUpperCase()}</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <h5 className="text-sm font-medium">Concept Mastery</h5>
                        {doc.concepts.map((concept) => (
                          <div key={concept.id} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{concept.name}</span>
                              <span className="text-muted-foreground">{concept.mastery}%</span>
                            </div>
                            <Progress value={concept.mastery} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="progress" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="glass">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      Learning Progress
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Overall Mastery</span>
                        <span>68%</span>
                      </div>
                      <Progress value={68} className="progress-shimmer" />
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Strong Areas:</span>
                          <p>Wave Mechanics, Basic Physics</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Focus Areas:</span>
                          <p>Quantum Physics, Advanced Topics</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-500" />
                      Study Recommendations
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 p-2 bg-background/50 rounded">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Review Quantum Mechanics basics</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-background/50 rounded">
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                        <span>Practice wave equations</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-background/50 rounded">
                        <HelpCircle className="h-4 w-4 text-blue-500" />
                        <span>Take concept quiz</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}