import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Calendar } from './ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Calendar as CalendarIcon, 
  Target, 
  Clock, 
  BookOpen, 
  Brain, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  Star,
  Zap,
  Trophy,
  Plus,
  Edit,
  Trash2,
  PlayCircle,
  PauseCircle,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface UserProfile {
  name: string;
  email: string;
  age: number;
  grade: string;
  subjects: string[];
  language: string;
  learningStyle: string;
  gender?: 'boy' | 'girl';
}

interface StudyGoal {
  id: string;
  title: string;
  subject: string;
  targetDate: Date;
  priority: 'low' | 'medium' | 'high';
  progress: number;
  totalHours: number;
  completedHours: number;
  topics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'active' | 'completed' | 'paused';
}

interface StudySession {
  id: string;
  goalId: string;
  topic: string;
  duration: number; // in minutes
  completed: boolean;
  date: Date;
  type: 'study' | 'quiz' | 'review' | 'practice';
  masteryGain: number;
  focus: number; // 1-10 rating
}

interface MasteryData {
  subject: string;
  topics: {
    name: string;
    mastery: number; // 0-100
    lastStudied: Date;
    eloRating: number;
    studyStreak: number;
    totalTime: number; // minutes
    weaknessLevel: 'none' | 'low' | 'medium' | 'high';
    nextReviewDate: Date;
  }[];
}

interface StudyPlannerProps {
  userProfile: UserProfile | null;
}

export function StudyPlanner({ userProfile }: StudyPlannerProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [studyGoals, setStudyGoals] = useState<StudyGoal[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [masteryData, setMasteryData] = useState<MasteryData[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isPlanning, setIsPlanning] = useState(false);
  const [activeSession, setActiveSession] = useState<StudySession | null>(null);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    subject: '',
    targetDate: new Date(),
    priority: 'medium' as const,
    totalHours: 10,
    topics: [] as string[],
    difficulty: 'intermediate' as const
  });

  // Initialize with mock data
  useEffect(() => {
    initializeMockData();
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && activeSession) {
      interval = setInterval(() => {
        setSessionTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, activeSession]);

  const initializeMockData = () => {
    // Mock study goals
    const mockGoals: StudyGoal[] = [
      {
        id: '1',
        title: 'Master Electromagnetic Waves',
        subject: 'Physics',
        targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        priority: 'high',
        progress: 65,
        totalHours: 20,
        completedHours: 13,
        topics: ['Wave Properties', 'Electromagnetic Spectrum', 'Energy Transfer'],
        difficulty: 'intermediate',
        status: 'active'
      },
      {
        id: '2',
        title: 'Calculus Fundamentals',
        subject: 'Mathematics',
        targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        priority: 'medium',
        progress: 30,
        totalHours: 25,
        completedHours: 7.5,
        topics: ['Derivatives', 'Integration', 'Limits'],
        difficulty: 'advanced',
        status: 'active'
      }
    ];

    // Mock mastery data
    const mockMastery: MasteryData[] = [
      {
        subject: 'Physics',
        topics: [
          {
            name: 'Electromagnetic Waves',
            mastery: 75,
            lastStudied: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            eloRating: 1450,
            studyStreak: 5,
            totalTime: 240,
            weaknessLevel: 'low',
            nextReviewDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
          },
          {
            name: 'Quantum Mechanics',
            mastery: 45,
            lastStudied: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            eloRating: 1200,
            studyStreak: 2,
            totalTime: 180,
            weaknessLevel: 'high',
            nextReviewDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
          }
        ]
      },
      {
        subject: 'Mathematics',
        topics: [
          {
            name: 'Calculus',
            mastery: 60,
            lastStudied: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            eloRating: 1350,
            studyStreak: 3,
            totalTime: 300,
            weaknessLevel: 'medium',
            nextReviewDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
          }
        ]
      }
    ];

    setStudyGoals(mockGoals);
    setMasteryData(mockMastery);
  };

  // Generate AI study plan
  const generateStudyPlan = async () => {
    setIsPlanning(true);
    toast.loading('AI is analyzing your learning patterns and creating optimal study plan...');

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simulate AI recommendations
      const recommendations = [
        {
          time: '09:00 - 10:30',
          activity: 'Deep Focus: Quantum Mechanics Review',
          priority: 'High',
          reason: 'Your peak focus time + weak area identified'
        },
        {
          time: '11:00 - 11:30',
          activity: 'Quick Quiz: Electromagnetic Waves',
          priority: 'Medium',
          reason: 'Spaced repetition due + maintain streak'
        },
        {
          time: '14:00 - 15:00',
          activity: 'Practice Problems: Calculus Integration',
          priority: 'Medium',
          reason: 'Afternoon energy suitable for practice'
        },
        {
          time: '16:30 - 17:00',
          activity: 'Light Review: Previous Topics',
          priority: 'Low',
          reason: 'Memory consolidation time'
        }
      ];

      toast.success('Personalized study plan generated! 🎯');
      // In real implementation, this would update the study schedule
    } catch (error) {
      toast.error('Failed to generate study plan. Please try again.');
    } finally {
      setIsPlanning(false);
    }
  };

  // Start study session
  const startStudySession = (topic: string, goalId: string, type: 'study' | 'quiz' | 'review' | 'practice' = 'study') => {
    const session: StudySession = {
      id: Math.random().toString(36).substr(2, 9),
      goalId,
      topic,
      duration: 0,
      completed: false,
      date: new Date(),
      type,
      masteryGain: 0,
      focus: 0
    };

    setActiveSession(session);
    setSessionTimer(0);
    setIsTimerRunning(true);
    toast.success(`Started ${type} session for ${topic} 📚`);
  };

  // End study session
  const endStudySession = (focus: number) => {
    if (!activeSession) return;

    const completedSession = {
      ...activeSession,
      duration: Math.floor(sessionTimer / 60), // convert to minutes
      completed: true,
      focus,
      masteryGain: Math.floor(Math.random() * 10) + 5 // Mock mastery gain
    };

    setStudySessions(prev => [...prev, completedSession]);
    
    // Update goal progress
    setStudyGoals(prev => prev.map(goal => {
      if (goal.id === activeSession.goalId) {
        const newCompletedHours = goal.completedHours + (completedSession.duration / 60);
        const newProgress = Math.min(100, (newCompletedHours / goal.totalHours) * 100);
        return {
          ...goal,
          completedHours: newCompletedHours,
          progress: newProgress
        };
      }
      return goal;
    }));

    setActiveSession(null);
    setIsTimerRunning(false);
    setSessionTimer(0);
    
    toast.success(`Session completed! +${completedSession.masteryGain} mastery points 🎉`);
  };

  // Add new goal
  const addNewGoal = () => {
    const goal: StudyGoal = {
      id: Math.random().toString(36).substr(2, 9),
      ...newGoal,
      progress: 0,
      completedHours: 0,
      status: 'active'
    };

    setStudyGoals(prev => [...prev, goal]);
    setShowGoalForm(false);
    setNewGoal({
      title: '',
      subject: '',
      targetDate: new Date(),
      priority: 'medium',
      totalHours: 10,
      topics: [],
      difficulty: 'intermediate'
    });
    
    toast.success('New study goal added! 🎯');
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getWeaknessColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-blue-600';
      case 'none': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Session Timer */}
      <AnimatePresence>
        {activeSession && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="glass-boy border-primary/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">📚</div>
                    <div>
                      <h3 className="font-semibold">{activeSession.topic}</h3>
                      <p className="text-sm text-muted-foreground">
                        {activeSession.type} session in progress
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-mono">
                        {formatTime(sessionTimer)}
                      </div>
                      <p className="text-xs text-muted-foreground">Study Time</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                      >
                        {isTimerRunning ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => endStudySession(8)} // Mock focus rating
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">📊 Dashboard</TabsTrigger>
          <TabsTrigger value="goals">🎯 Goals</TabsTrigger>
          <TabsTrigger value="mastery">🧠 Mastery</TabsTrigger>
          <TabsTrigger value="calendar">📅 Calendar</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Study Stats */}
            <Card className="glass hover-lift">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-4 w-4" />
                  Today's Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text">2.5h</div>
                  <p className="text-sm text-muted-foreground">Study Time</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Physics</span>
                    <span>1.5h</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Math</span>
                    <span>1h</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Streak Counter */}
            <Card className="glass-girl hover-lift">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Zap className="h-4 w-4" />
                  Study Streak
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-2">
                <div className="text-3xl font-bold text-orange-500">🔥 7</div>
                <p className="text-sm text-muted-foreground">Days in a row!</p>
                <p className="text-xs text-green-600">Keep it up, you're amazing!</p>
              </CardContent>
            </Card>

            {/* Next Focus */}
            <Card className="glass hover-lift">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target className="h-4 w-4" />
                  Next Focus
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm font-medium">Quantum Mechanics</div>
                <Badge variant="destructive" className="text-xs">
                  Needs Review
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Due for spaced repetition
                </p>
                <Button 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => startStudySession('Quantum Mechanics', '1', 'review')}
                >
                  Start Review
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* AI Study Plan */}
          <Card className="glass hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Study Plan for Today ✨
                </span>
                <Button onClick={generateStudyPlan} disabled={isPlanning} size="sm">
                  {isPlanning ? (
                    <>
                      <Brain className="mr-2 h-4 w-4 animate-pulse" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Regenerate
                    </>
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <Star className="h-4 w-4" />
                <AlertDescription>
                  Your personalized plan based on circadian rhythms, mastery levels, and spaced repetition science! 🧬
                </AlertDescription>
              </Alert>
              
              <div className="space-y-3">
                {[
                  { time: '09:00 - 10:30', activity: 'Deep Focus: Quantum Mechanics Review', priority: 'High', reason: 'Peak focus + weak area' },
                  { time: '11:00 - 11:30', activity: 'Quick Quiz: Electromagnetic Waves', priority: 'Medium', reason: 'Spaced repetition due' },
                  { time: '14:00 - 15:00', activity: 'Practice: Calculus Integration', priority: 'Medium', reason: 'Perfect practice window' },
                  { time: '16:30 - 17:00', activity: 'Light Review: Previous Topics', priority: 'Low', reason: 'Memory consolidation' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs">
                            {item.time}
                          </Badge>
                          <Badge className={`text-xs ${getPriorityColor(item.priority.toLowerCase())}`}>
                            {item.priority}
                          </Badge>
                        </div>
                        <h4 className="font-medium mt-2">{item.activity}</h4>
                        <p className="text-sm text-muted-foreground">{item.reason}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => startStudySession(item.activity.split(': ')[1], '1')}
                      >
                        Start
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold gradient-text">Study Goals 🎯</h2>
            <Button onClick={() => setShowGoalForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Goal
            </Button>
          </div>

          {/* Add Goal Form */}
          <AnimatePresence>
            {showGoalForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="glass-girl">
                  <CardHeader>
                    <CardTitle>Create New Study Goal ✨</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Goal Title</Label>
                        <Input
                          value={newGoal.title}
                          onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g., Master Quantum Physics"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Subject</Label>
                        <Select value={newGoal.subject} onValueChange={(value) => setNewGoal(prev => ({ ...prev, subject: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Physics">Physics</SelectItem>
                            <SelectItem value="Mathematics">Mathematics</SelectItem>
                            <SelectItem value="Chemistry">Chemistry</SelectItem>
                            <SelectItem value="Biology">Biology</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Estimated Study Hours: {newGoal.totalHours}</Label>
                      <Slider
                        value={[newGoal.totalHours]}
                        onValueChange={([value]) => setNewGoal(prev => ({ ...prev, totalHours: value }))}
                        min={5}
                        max={100}
                        step={5}
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button onClick={addNewGoal} disabled={!newGoal.title || !newGoal.subject}>
                        Create Goal
                      </Button>
                      <Button variant="outline" onClick={() => setShowGoalForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Goals List */}
          <div className="space-y-4">
            {studyGoals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{goal.title}</h3>
                          <Badge className={getPriorityColor(goal.priority)}>
                            {goal.priority}
                          </Badge>
                          <Badge variant="outline">
                            {goal.subject}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Target: {goal.targetDate.toLocaleDateString()} • 
                          {goal.completedHours.toFixed(1)}/{goal.totalHours}h completed
                        </p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{Math.round(goal.progress)}%</span>
                          </div>
                          <Progress value={goal.progress} className="h-2" />
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button 
                          size="sm" 
                          onClick={() => startStudySession(goal.topics[0] || goal.title, goal.id)}
                        >
                          <PlayCircle className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {goal.topics.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {goal.topics.map((topic, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Mastery Tab */}
        <TabsContent value="mastery" className="space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold gradient-text">Knowledge Mastery Graph 🧠</h2>
            <p className="text-muted-foreground">
              Track your understanding with Elo-like ratings and spaced repetition science
            </p>
          </div>

          {masteryData.map((subject, index) => (
            <motion.div
              key={subject.subject}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="glass hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {subject.subject}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {subject.topics.map((topic, topicIndex) => (
                    <motion.div
                      key={topic.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: topicIndex * 0.1 }}
                      className="p-4 border rounded-lg bg-muted/20"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium">{topic.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              Elo: {topic.eloRating}
                            </Badge>
                            <Badge className={`text-xs ${getWeaknessColor(topic.weaknessLevel)}`}>
                              {topic.weaknessLevel === 'none' ? '✅ Mastered' : 
                               topic.weaknessLevel === 'low' ? '📈 Improving' :
                               topic.weaknessLevel === 'medium' ? '📚 Practice' : '🚨 Focus Needed'}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Mastery Level</span>
                              <span>{topic.mastery}%</span>
                            </div>
                            <Progress value={topic.mastery} className="h-2" />
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                            <div>
                              <span className="text-muted-foreground">Streak:</span>
                              <div className="font-medium">🔥 {topic.studyStreak} days</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Study Time:</span>
                              <div className="font-medium">{Math.floor(topic.totalTime / 60)}h {topic.totalTime % 60}m</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Last Studied:</span>
                              <div className="font-medium">{topic.lastStudied.toLocaleDateString()}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Next Review:</span>
                              <div className="font-medium">{topic.nextReviewDate.toLocaleDateString()}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          <Button 
                            size="sm"
                            variant={topic.weaknessLevel === 'high' ? 'default' : 'outline'}
                            onClick={() => startStudySession(topic.name, '1', 'study')}
                          >
                            Study
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => startStudySession(topic.name, '1', 'quiz')}
                          >
                            Quiz
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Study Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle>
                  Schedule for {selectedDate.toLocaleDateString()}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Mock schedule for selected date */}
                {[
                  { time: '09:00', activity: 'Physics Review', duration: '90 min', type: 'study' },
                  { time: '11:00', activity: 'Math Quiz', duration: '30 min', type: 'quiz' },
                  { time: '14:00', activity: 'Chemistry Practice', duration: '60 min', type: 'practice' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="text-sm font-mono">{item.time}</div>
                    <div className="flex-1">
                      <div className="font-medium">{item.activity}</div>
                      <div className="text-sm text-muted-foreground">{item.duration}</div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {item.type}
                    </Badge>
                  </div>
                ))}
                
                <Button className="w-full mt-4" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Study Session
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}