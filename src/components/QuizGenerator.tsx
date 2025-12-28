import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Brain, CheckCircle, XCircle, RotateCcw, Trophy, Wand2, Target, Clock, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  concept: string;
  timeEstimate: number; // in seconds
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  answers: { questionId: number; selectedAnswer: number; correct: boolean; timeSpent: number }[];
  masteryLevel: number; // 0-100
  weakAreas: string[];
  strongAreas: string[];
}

interface QuizSettings {
  difficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
  questionCount: number;
  topics: string[];
  timeLimit?: number;
  focusMode: 'review' | 'learning' | 'test';
}

export function QuizGenerator() {
  const [currentQuiz, setCurrentQuiz] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [userAnswers, setUserAnswers] = useState<{ questionId: number; selectedAnswer: number; timeSpent: number }[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [quizSettings, setQuizSettings] = useState<QuizSettings>({
    difficulty: 'medium',
    questionCount: 5,
    topics: ['Physics'],
    timeLimit: undefined,
    focusMode: 'learning'
  });
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [streak, setStreak] = useState(0);

  // Enhanced question banks by topic and difficulty
  const questionBanks = {
    Physics: {
      easy: [
        {
          id: 1,
          question: "What is the speed of light in vacuum?",
          options: ["3.00 × 10^6 m/s", "3.00 × 10^8 m/s", "3.00 × 10^10 m/s", "3.00 × 10^12 m/s"],
          correctAnswer: 1,
          explanation: "The speed of light in vacuum is a fundamental constant: c = 3.00 × 10^8 m/s",
          difficulty: 'easy' as const,
          topic: 'Electromagnetic Waves',
          concept: 'Speed of Light',
          timeEstimate: 30
        },
        {
          id: 2,
          question: "What type of wave are electromagnetic waves?",
          options: ["Longitudinal waves", "Transverse waves", "Standing waves", "Surface waves"],
          correctAnswer: 1,
          explanation: "Electromagnetic waves are transverse waves where electric and magnetic fields oscillate perpendicular to the direction of propagation.",
          difficulty: 'easy' as const,
          topic: 'Wave Properties',
          concept: 'Wave Types',
          timeEstimate: 25
        }
      ],
      medium: [
        {
          id: 3,
          question: "Which equation relates energy and frequency for photons?",
          options: ["E = mc²", "E = hf", "E = ½mv²", "E = mgh"],
          correctAnswer: 1,
          explanation: "Planck's equation E = hf relates the energy of a photon to its frequency, where h is Planck's constant.",
          difficulty: 'medium' as const,
          topic: 'Quantum Physics',
          concept: 'Photon Energy',
          timeEstimate: 45
        },
        {
          id: 4,
          question: "If the frequency of an electromagnetic wave is doubled, what happens to its wavelength?",
          options: ["It doubles", "It halves", "It quadruples", "It remains the same"],
          correctAnswer: 1,
          explanation: "From c = λf, if frequency doubles and speed of light is constant, wavelength must halve.",
          difficulty: 'medium' as const,
          topic: 'Wave Properties',
          concept: 'Frequency-Wavelength Relationship',
          timeEstimate: 60
        }
      ],
      hard: [
        {
          id: 5,
          question: "Calculate the momentum of a photon with wavelength 500 nm. (h = 6.626 × 10^-34 J·s, c = 3 × 10^8 m/s)",
          options: ["1.33 × 10^-27 kg⋅m/s", "2.21 × 10^-27 kg⋅m/s", "4.42 × 10^-27 kg⋅m/s", "8.84 × 10^-27 kg⋅m/s"],
          correctAnswer: 0,
          explanation: "Using p = h/λ = (6.626 × 10^-34)/(500 × 10^-9) = 1.33 × 10^-27 kg⋅m/s",
          difficulty: 'hard' as const,
          topic: 'Quantum Physics',
          concept: 'Photon Momentum',
          timeEstimate: 120
        }
      ]
    },
    Mathematics: {
      easy: [
        {
          id: 6,
          question: "What is the derivative of x²?",
          options: ["x", "2x", "x²", "2x²"],
          correctAnswer: 1,
          explanation: "Using the power rule: d/dx(x²) = 2x¹ = 2x",
          difficulty: 'easy' as const,
          topic: 'Calculus',
          concept: 'Basic Derivatives',
          timeEstimate: 20
        }
      ],
      medium: [
        {
          id: 7,
          question: "Solve: ∫x² dx",
          options: ["x³/3 + C", "2x + C", "x³ + C", "x²/2 + C"],
          correctAnswer: 0,
          explanation: "Using the power rule for integration: ∫x² dx = x³/3 + C",
          difficulty: 'medium' as const,
          topic: 'Calculus',
          concept: 'Basic Integration',
          timeEstimate: 40
        }
      ],
      hard: [
        {
          id: 8,
          question: "Find the limit: lim(x→0) (sin x)/x",
          options: ["0", "1", "∞", "undefined"],
          correctAnswer: 1,
          explanation: "This is a fundamental limit in calculus: lim(x→0) (sin x)/x = 1",
          difficulty: 'hard' as const,
          topic: 'Calculus',
          concept: 'L\'Hôpital\'s Rule',
          timeEstimate: 90
        }
      ]
    }
  };

  const availableTopics = ['Physics', 'Mathematics', 'Chemistry', 'Biology'];

  // Generate personalized quiz based on settings
  const generateQuiz = async () => {
    setIsGenerating(true);
    toast.loading('AI is crafting your personalized quiz...');

    try {
      // Simulate AI generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      let selectedQuestions: Question[] = [];
      const { difficulty, questionCount, topics } = quizSettings;

      // Get questions from selected topics
      for (const topic of topics) {
        const topicQuestions = questionBanks[topic as keyof typeof questionBanks];
        if (!topicQuestions) continue;

        if (difficulty === 'adaptive') {
          // Mix difficulties for adaptive mode
          const easyQuestions = topicQuestions.easy || [];
          const mediumQuestions = topicQuestions.medium || [];
          const hardQuestions = topicQuestions.hard || [];
          
          selectedQuestions.push(
            ...shuffleArray([...easyQuestions, ...mediumQuestions, ...hardQuestions])
          );
        } else {
          const difficultyQuestions = topicQuestions[difficulty] || [];
          selectedQuestions.push(...difficultyQuestions);
        }
      }

      // Shuffle and limit to requested count
      selectedQuestions = shuffleArray(selectedQuestions).slice(0, questionCount);

      if (selectedQuestions.length === 0) {
        throw new Error('No questions available for selected criteria');
      }

      setCurrentQuiz(selectedQuestions);
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setQuizCompleted(false);
      setQuizResult(null);
      setSelectedAnswer('');
      setShowSettings(false);
      setQuestionStartTime(Date.now());
      
      toast.success(`Generated ${selectedQuestions.length} personalized questions!`);
    } catch (error) {
      toast.error('Failed to generate quiz. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Utility function to shuffle array
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value);
  };

  const submitAnswer = () => {
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    const answer = {
      questionId: currentQuiz[currentQuestionIndex].id,
      selectedAnswer: parseInt(selectedAnswer),
      timeSpent
    };
    
    setUserAnswers(prev => [...prev, answer]);
    
    // Check if answer is correct for streak
    const isCorrect = answer.selectedAnswer === currentQuiz[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
      setStreak(prev => prev + 1);
      toast.success(`Correct! 🎉 Streak: ${streak + 1}`);
    } else {
      setStreak(0);
      toast.error('Incorrect, but you\'re learning! 💪');
    }
    
    if (currentQuestionIndex < currentQuiz.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer('');
      setQuestionStartTime(Date.now());
    } else {
      completeQuiz([...userAnswers, answer]);
    }
  };

  const completeQuiz = (answers: { questionId: number; selectedAnswer: number; timeSpent: number }[]) => {
    const results = answers.map(answer => {
      const question = currentQuiz.find(q => q.id === answer.questionId);
      return {
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        correct: question ? answer.selectedAnswer === question.correctAnswer : false,
        timeSpent: answer.timeSpent
      };
    });
    
    const score = results.filter(r => r.correct).length;
    const masteryLevel = Math.round((score / currentQuiz.length) * 100);
    
    // Analyze weak and strong areas
    const topicPerformance: { [key: string]: { correct: number; total: number } } = {};
    
    currentQuiz.forEach((question, index) => {
      const topic = question.topic;
      if (!topicPerformance[topic]) {
        topicPerformance[topic] = { correct: 0, total: 0 };
      }
      topicPerformance[topic].total++;
      if (results[index]?.correct) {
        topicPerformance[topic].correct++;
      }
    });
    
    const weakAreas = Object.entries(topicPerformance)
      .filter(([_, perf]) => perf.correct / perf.total < 0.7)
      .map(([topic]) => topic);
      
    const strongAreas = Object.entries(topicPerformance)
      .filter(([_, perf]) => perf.correct / perf.total >= 0.8)
      .map(([topic]) => topic);
    
    setQuizResult({
      score,
      totalQuestions: currentQuiz.length,
      answers: results,
      masteryLevel,
      weakAreas,
      strongAreas
    });
    
    setQuizCompleted(true);
    toast.success(`Quiz completed! Score: ${score}/${currentQuiz.length} (${masteryLevel}%)`);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setQuizCompleted(false);
    setQuizResult(null);
    setSelectedAnswer('');
    setStreak(0);
    setQuestionStartTime(Date.now());
  };

  const newQuiz = () => {
    setShowSettings(true);
    setCurrentQuiz([]);
    setQuizCompleted(false);
    setQuizResult(null);
    setStreak(0);
  };

  // Quiz Settings Component
  if (showSettings) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card className="glass hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              Create Your Personalized Quiz ✨
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Difficulty Selection */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Difficulty Level
                </Label>
                <Select value={quizSettings.difficulty} onValueChange={(value: any) => 
                  setQuizSettings(prev => ({ ...prev, difficulty: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">🌱 Easy - Building Foundation</SelectItem>
                    <SelectItem value="medium">🎯 Medium - Applying Knowledge</SelectItem>
                    <SelectItem value="hard">🚀 Hard - Mastery Challenge</SelectItem>
                    <SelectItem value="adaptive">🧠 Adaptive - AI Optimized</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Question Count */}
              <div className="space-y-3">
                <Label>Number of Questions: {quizSettings.questionCount}</Label>
                <Slider
                  value={[quizSettings.questionCount]}
                  onValueChange={([value]) => 
                    setQuizSettings(prev => ({ ...prev, questionCount: value }))}
                  min={3}
                  max={20}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Quick (3)</span>
                  <span>Standard (10)</span>
                  <span>Comprehensive (20)</span>
                </div>
              </div>
            </div>

            {/* Focus Mode */}
            <div className="space-y-3">
              <Label>Focus Mode</Label>
              <div className="grid grid-cols-3 gap-3">
                {['learning', 'review', 'test'].map((mode) => (
                  <Button
                    key={mode}
                    variant={quizSettings.focusMode === mode ? 'default' : 'outline'}
                    onClick={() => setQuizSettings(prev => ({ ...prev, focusMode: mode as any }))}
                    className="h-20 flex flex-col gap-2"
                  >
                    <div className="text-2xl">
                      {mode === 'learning' ? '🎓' : mode === 'review' ? '📚' : '⏱️'}
                    </div>
                    <span className="capitalize">{mode}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Time Limit Toggle */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time Challenge (Optional)
              </Label>
              <div className="flex items-center gap-4">
                <Button
                  variant={quizSettings.timeLimit ? 'outline' : 'default'}
                  onClick={() => setQuizSettings(prev => ({ ...prev, timeLimit: undefined }))}
                >
                  No Limit
                </Button>
                <Button
                  variant={quizSettings.timeLimit === 300 ? 'default' : 'outline'}
                  onClick={() => setQuizSettings(prev => ({ ...prev, timeLimit: 300 }))}
                >
                  5 min
                </Button>
                <Button
                  variant={quizSettings.timeLimit === 600 ? 'default' : 'outline'}
                  onClick={() => setQuizSettings(prev => ({ ...prev, timeLimit: 600 }))}
                >
                  10 min
                </Button>
              </div>
            </div>

            <Button onClick={generateQuiz} size="lg" className="w-full" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Brain className="mr-2 h-5 w-5 animate-pulse" />
                  Generating Your Quiz...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Personalized Quiz
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (isGenerating) {
    return (
      <Card className="glass">
        <CardContent className="text-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="mx-auto h-16 w-16 text-primary mb-4" />
          </motion.div>
          <h3 className="text-xl font-semibold mb-2">AI is crafting your quiz...</h3>
          <p className="text-muted-foreground">
            Analyzing your learning patterns and generating personalized questions
          </p>
        </CardContent>
      </Card>
    );
  }

  if (quizCompleted && quizResult) {
    const percentage = Math.round((quizResult.score / quizResult.totalQuestions) * 100);
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <Card className="glass-girl hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Quiz Results ✨
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score Display */}
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-6xl font-bold mb-2 gradient-text"
              >
                {percentage}%
              </motion.div>
              <p className="text-lg mb-2">You scored {quizResult.score} out of {quizResult.totalQuestions}</p>
              <Badge 
                variant={percentage >= 80 ? "default" : percentage >= 60 ? "secondary" : "destructive"}
                className="text-base px-4 py-2"
              >
                {percentage >= 90 ? "Outstanding! 🌟" : 
                 percentage >= 80 ? "Excellent! 🎉" : 
                 percentage >= 70 ? "Great Job! 👏" : 
                 percentage >= 60 ? "Good Effort! 💪" : "Keep Learning! 📚"}
              </Badge>
            </div>

            {/* Mastery Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Mastery Level</span>
                <span className="text-sm text-muted-foreground">{quizResult.masteryLevel}%</span>
              </div>
              <Progress value={quizResult.masteryLevel} className="h-3" />
            </div>

            {/* Performance Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizResult.strongAreas.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-green-600">🌟 Strong Areas</h4>
                  <div className="flex flex-wrap gap-1">
                    {quizResult.strongAreas.map((area, index) => (
                      <Badge key={index} variant="outline" className="border-green-200 text-green-700">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {quizResult.weakAreas.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-600">💪 Areas to Focus</h4>
                  <div className="flex flex-wrap gap-1">
                    {quizResult.weakAreas.map((area, index) => (
                      <Badge key={index} variant="outline" className="border-blue-200 text-blue-700">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Question Review */}
            <div className="space-y-4">
              <h4 className="font-medium">Question Review</h4>
              {currentQuiz.map((question, index) => {
                const userAnswer = quizResult.answers.find(a => a.questionId === question.id);
                const isCorrect = userAnswer?.correct || false;
                
                return (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg bg-muted/30"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="font-medium">{question.question}</p>
                        <div className="text-sm space-y-1">
                          <p className="text-green-600">
                            ✅ Correct: {question.options[question.correctAnswer]}
                          </p>
                          {!isCorrect && (
                            <p className="text-red-600">
                              ❌ Your answer: {question.options[userAnswer?.selectedAnswer || 0]}
                            </p>
                          )}
                          <p className="text-muted-foreground italic">{question.explanation}</p>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="text-xs">
                              {question.difficulty}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {question.topic}
                            </Badge>
                            {userAnswer && (
                              <Badge variant="outline" className="text-xs">
                                {userAnswer.timeSpent}s
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button onClick={restartQuiz} variant="outline" className="flex-1">
                <RotateCcw className="mr-2 h-4 w-4" />
                Retake Quiz
              </Button>
              <Button onClick={newQuiz} className="flex-1">
                <Wand2 className="mr-2 h-4 w-4" />
                Generate New Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const currentQuestion = currentQuiz[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / currentQuiz.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="glass-boy hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              {currentQuestion.topic} Quiz
            </span>
            <div className="flex items-center gap-3">
              {streak > 0 && (
                <Badge variant="outline" className="bg-gradient-to-r from-yellow-100 to-orange-100">
                  🔥 {streak} streak
                </Badge>
              )}
              <Badge variant="outline">
                {currentQuestionIndex + 1} of {currentQuiz.length}
              </Badge>
            </div>
          </CardTitle>
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Difficulty: {currentQuestion.difficulty}</span>
              <span>Concept: {currentQuestion.concept}</span>
              <span>~{currentQuestion.timeEstimate}s</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <h3 className="text-lg font-medium mb-6">{currentQuestion.question}</h3>
            
            <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
              <AnimatePresence>
                {currentQuestion.options.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </motion.div>
                ))}
              </AnimatePresence>
            </RadioGroup>
          </motion.div>
          
          <div className="flex gap-3">
            <Button onClick={newQuiz} variant="outline">
              <Wand2 className="mr-2 h-4 w-4" />
              New Quiz
            </Button>
            <Button 
              onClick={submitAnswer} 
              disabled={!selectedAnswer}
              className="flex-1"
            >
              {currentQuestionIndex < currentQuiz.length - 1 ? 'Next Question' : 'Complete Quiz'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}