import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Calendar } from './ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  TrendingUp, 
  Brain, 
  Trophy, 
  Users, 
  Zap, 
  Target, 
  Calendar as CalendarIcon,
  Clock,
  BookOpen,
  Star,
  Play,
  Award,
  MessageCircle,
  Video,
  FileText,
  Globe,
  Heart,
  Gift,
  Sparkles,
  Coffee,
  Lightbulb,
  Rocket
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

interface StudyStreak {
  current: number;
  longest: number;
  lastStudyDate: Date;
}

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  type: 'quiz' | 'flashcard' | 'reading' | 'practice';
  progress: number;
  completed: boolean;
  timeLimit?: number; // minutes
}

interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  members: number;
  level: string;
  language: string;
  isOnline: boolean;
  nextSession?: Date;
  avatar: string;
}

interface TodaysPlan {
  id: string;
  time: string;
  activity: string;
  subject: string;
  type: 'study' | 'quiz' | 'review' | 'break';
  duration: number;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'studying' | 'offline';
  currentStreak: number;
  lastActive: Date;
  subjects: string[];
}

interface InteractiveDashboardProps {
  userProfile: UserProfile | null;
}

export function InteractiveDashboard({ userProfile }: InteractiveDashboardProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [studyStreak, setStudyStreak] = useState<StudyStreak>({
    current: 7,
    longest: 12,
    lastStudyDate: new Date()
  });
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([]);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [todaysPlans, setTodaysPlans] = useState<TodaysPlan[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Initialize mock data
    initializeMockData();
    
    // Update current time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timeInterval);
  }, []);

  const initializeMockData = () => {
    // Mock daily challenges
    const mockChallenges: DailyChallenge[] = [
      {
        id: '1',
        title: 'Physics Lightning Round',
        description: 'Complete 10 electromagnetic wave questions in 5 minutes',
        difficulty: 'medium',
        points: 150,
        type: 'quiz',
        progress: 60,
        completed: false,
        timeLimit: 5
      },
      {
        id: '2',
        title: 'Math Mastery Sprint',
        description: 'Review 20 calculus flashcards with 90% accuracy',
        difficulty: 'hard',
        points: 200,
        type: 'flashcard',
        progress: 25,
        completed: false
      },
      {
        id: '3',
        title: 'Daily Reading Goal',
        description: 'Read and summarize one chemistry chapter',
        difficulty: 'easy',
        points: 100,
        type: 'reading',
        progress: 100,
        completed: true
      }
    ];

    // Mock study groups
    const mockGroups: StudyGroup[] = [
      {
        id: '1',
        name: 'Physics Warriors',
        subject: 'Physics',
        members: 24,
        level: 'Intermediate',
        language: 'English',
        isOnline: true,
        nextSession: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        avatar: '⚛️'
      },
      {
        id: '2',
        name: 'Math Wizards',
        subject: 'Mathematics',
        members: 18,
        level: 'Advanced',
        language: 'English',
        isOnline: true,
        nextSession: new Date(Date.now() + 4 * 60 * 60 * 1000),
        avatar: '🧮'
      },
      {
        id: '3',
        name: 'Chemistry Club',
        subject: 'Chemistry',
        members: 15,
        level: 'Beginner',
        language: 'Hindi',
        isOnline: false,
        avatar: '🧪'
      }
    ];

    // Mock today's plans
    const mockPlans: TodaysPlan[] = [
      {
        id: '1',
        time: '09:00',
        activity: 'Review Electromagnetic Waves',
        subject: 'Physics',
        type: 'review',
        duration: 45,
        priority: 'high',
        completed: true
      },
      {
        id: '2',
        time: '10:00',
        activity: 'Practice Calculus Problems',
        subject: 'Mathematics',
        type: 'study',
        duration: 60,
        priority: 'medium',
        completed: false
      },
      {
        id: '3',
        time: '11:30',
        activity: 'Break & Refresh',
        subject: '',
        type: 'break',
        duration: 15,
        priority: 'low',
        completed: false
      },
      {
        id: '4',
        time: '14:00',
        activity: 'Chemistry Quiz',
        subject: 'Chemistry',
        type: 'quiz',
        duration: 30,
        priority: 'high',
        completed: false
      }
    ];

    // Mock friends
    const mockFriends: Friend[] = [
      {
        id: '1',
        name: 'Sarah Chen',
        avatar: '👩‍🎓',
        status: 'studying',
        currentStreak: 5,
        lastActive: new Date(),
        subjects: ['Physics', 'Math']
      },
      {
        id: '2',
        name: 'Alex Kumar',
        avatar: '👨‍🎓',
        status: 'online',
        currentStreak: 12,
        lastActive: new Date(Date.now() - 30 * 60 * 1000),
        subjects: ['Chemistry', 'Biology']
      },
      {
        id: '3',
        name: 'Emma Wilson',
        avatar: '👩‍💼',
        status: 'offline',
        currentStreak: 8,
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
        subjects: ['Math', 'Physics']
      }
    ];

    setDailyChallenges(mockChallenges);
    setStudyGroups(mockGroups);
    setTodaysPlans(mockPlans);
    setFriends(mockFriends);
  };

  const handleChallengeStart = (challengeId: string) => {
    const challenge = dailyChallenges.find(c => c.id === challengeId);
    if (challenge) {
      toast.success(`Starting ${challenge.title}! 🚀`);
      // In real app, this would navigate to the challenge
    }
  };

  const handleJoinGroup = (groupId: string) => {
    const group = studyGroups.find(g => g.id === groupId);
    if (group) {
      toast.success(`Joined ${group.name}! 👥`);
      // In real app, this would handle group joining
    }
  };

  const handleStartActivity = (planId: string) => {
    const plan = todaysPlans.find(p => p.id === planId);
    if (plan) {
      setTodaysPlans(prev => prev.map(p => 
        p.id === planId ? { ...p, completed: true } : p
      ));
      toast.success(`Started: ${plan.activity} ⚡`);
    }
  };

  const handleAddFriend = (friendId: string) => {
    const friend = friends.find(f => f.id === friendId);
    if (friend) {
      toast.success(`Friend request sent to ${friend.name}! 💌`);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'studying': return 'bg-blue-400';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const formatTimeFromNow = (date: Date) => {
    const diffMs = date.getTime() - Date.now();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${Math.floor(diffHours / 24)}d`;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h1 className="text-3xl font-bold gradient-text">
          Welcome back, {userProfile?.name || 'Student'}! ✨
        </h1>
        <p className="text-muted-foreground">
          Ready to continue your amazing learning journey?
        </p>
      </motion.div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Card className="glass-girl hover-lift cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">🔥</div>
              <div className="text-2xl font-bold text-orange-500">{studyStreak.current}</div>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Card className="glass-boy hover-lift cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">🏆</div>
              <div className="text-2xl font-bold text-yellow-500">2,450</div>
              <p className="text-xs text-muted-foreground">XP Points</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Card className="glass hover-lift cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">📚</div>
              <div className="text-2xl font-bold text-blue-500">15</div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Card className="glass hover-lift cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-2xl font-bold text-purple-500">87%</div>
              <p className="text-xs text-muted-foreground">Accuracy</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Plan */}
          <Card className="glass hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Today's Study Plan 📅
                </span>
                <Button size="sm" variant="outline">
                  <Sparkles className="h-4 w-4 mr-1" />
                  AI Suggest
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {todaysPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border transition-all ${
                    plan.completed 
                      ? 'bg-green-50 border-green-200' 
                      : plan.type === 'break' 
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white border-gray-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {plan.time}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{getPriorityIcon(plan.priority)}</span>
                          <span className={`font-medium ${plan.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {plan.activity}
                          </span>
                          {plan.subject && (
                            <Badge variant="outline" className="text-xs">
                              {plan.subject}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {plan.duration} minutes • {plan.type}
                        </p>
                      </div>
                    </div>
                    
                    {!plan.completed && (
                      <Button 
                        size="sm" 
                        onClick={() => handleStartActivity(plan.id)}
                        className="h-8"
                      >
                        <Play className="h-3 w-3" />
                      </Button>
                    )}
                    
                    {plan.completed && (
                      <div className="text-green-600">
                        ✅
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Daily Challenges */}
          <Card className="glass-girl hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Daily Challenges 🎯
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dailyChallenges.map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                    challenge.completed ? 'bg-green-50 border-green-200' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{challenge.title}</h4>
                        <Badge className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                        {challenge.completed && <span className="text-green-600">✅</span>}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {challenge.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>🎁 {challenge.points} points</span>
                        {challenge.timeLimit && <span>⏱️ {challenge.timeLimit} min</span>}
                        <span>📝 {challenge.type}</span>
                      </div>
                    </div>
                    
                    {!challenge.completed && (
                      <Button 
                        size="sm" 
                        onClick={() => handleChallengeStart(challenge.id)}
                      >
                        Start
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{challenge.progress}%</span>
                    </div>
                    <Progress value={challenge.progress} className="h-2" />
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Study Groups */}
          <Card className="glass-boy hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Study Groups 👥
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {studyGroups.map((group, index) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg border bg-white hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{group.avatar}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{group.name}</h4>
                          {group.isOnline && (
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              🟢 Live
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>📚 {group.subject}</span>
                          <span>👥 {group.members} members</span>
                          <span>📈 {group.level}</span>
                        </div>
                        {group.nextSession && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Next session: {formatTimeFromNow(group.nextSession)}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleJoinGroup(group.id)}
                    >
                      Join
                    </Button>
                  </div>
                </motion.div>
              ))}
              
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Discover More Groups
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Mini Calendar */}
          <Card className="glass hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarIcon className="h-4 w-4" />
                Study Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border-0"
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center",
                  caption_label: "text-sm font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground",
                  day_outside: "text-muted-foreground opacity-50",
                  day_disabled: "text-muted-foreground opacity-50",
                  day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                  day_hidden: "invisible",
                }}
              />
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span>Study completed</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span>Quiz scheduled</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span>Review planned</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Friends Online */}
          <Card className="glass-girl hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Heart className="h-4 w-4" />
                Friends Online
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {friends.map((friend, index) => (
                <motion.div
                  key={friend.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-white border hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="text-xl">{friend.avatar}</div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(friend.status)}`}></div>
                    </div>
                    <div>
                      <h5 className="font-medium text-sm">{friend.name}</h5>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>🔥 {friend.currentStreak}</span>
                        <span>•</span>
                        <span>{friend.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleAddFriend(friend.id)}
                    className="h-8 w-8 p-0"
                  >
                    <MessageCircle className="h-3 w-3" />
                  </Button>
                </motion.div>
              ))}
              
              <Button variant="outline" size="sm" className="w-full">
                <Users className="h-3 w-3 mr-2" />
                Find Study Buddies
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="glass-boy hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Rocket className="h-4 w-4" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {[
                { icon: <Brain className="h-4 w-4" />, label: 'AI Quiz', color: 'bg-purple-100 text-purple-700' },
                { icon: <FileText className="h-4 w-4" />, label: 'Upload', color: 'bg-blue-100 text-blue-700' },
                { icon: <Video className="h-4 w-4" />, label: 'Live Study', color: 'bg-green-100 text-green-700' },
                { icon: <Globe className="h-4 w-4" />, label: 'Global Rank', color: 'bg-orange-100 text-orange-700' },
                { icon: <Coffee className="h-4 w-4" />, label: 'Break Timer', color: 'bg-yellow-100 text-yellow-700' },
                { icon: <Lightbulb className="h-4 w-4" />, label: 'Study Tips', color: 'bg-pink-100 text-pink-700' }
              ].map((action, index) => (
                <motion.div
                  key={action.label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    className={`h-auto p-3 flex flex-col gap-2 ${action.color} border-0 hover:shadow-md transition-all`}
                    onClick={() => toast.success(`Opening ${action.label}! ✨`)}
                  >
                    {action.icon}
                    <span className="text-xs">{action.label}</span>
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}