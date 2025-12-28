import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  BookOpen, 
  Brain, 
  Target, 
  Flame, 
  Trophy, 
  TrendingUp,
  Clock,
  Zap,
  Calendar,
  Award,
  Star,
  Users,
  Map,
  ArrowUp,
  ArrowDown,
  Activity
} from 'lucide-react';
import { RobotCharacter } from './RobotCharacter';

interface ConceptNode {
  id: string;
  name: string;
  mastery: number;
  prerequisites: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  subject: string;
  lastStudied: Date;
  attempts: number;
  correctAnswers: number;
}

interface StudyStats {
  totalStudyTime: number;
  conceptsMastered: number;
  totalConcepts: number;
  weeklyStreak: number;
  globalRank: number;
  totalUsers: number;
  xpEarned: number;
  level: number;
  nextLevelXP: number;
}

interface WeakArea {
  concept: string;
  subject: string;
  masteryLevel: number;
  improvement: number;
}

export function EnhancedDashboard({ userProfile }: { userProfile: any }) {
  const [studyStats, setStudyStats] = useState<StudyStats>({
    totalStudyTime: 1250,
    conceptsMastered: 47,
    totalConcepts: 120,
    weeklyStreak: 12,
    globalRank: 1247,
    totalUsers: 50000,
    xpEarned: 2840,
    level: 8,
    nextLevelXP: 3000
  });

  const [conceptGraph, setConceptGraph] = useState<ConceptNode[]>([
    {
      id: 'electromagnetic-waves',
      name: 'Electromagnetic Waves',
      mastery: 85,
      prerequisites: ['electric-fields', 'magnetic-fields'],
      difficulty: 'medium',
      subject: 'Physics',
      lastStudied: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      attempts: 12,
      correctAnswers: 10
    },
    {
      id: 'quantum-mechanics',
      name: 'Quantum Mechanics',
      mastery: 45,
      prerequisites: ['electromagnetic-waves', 'wave-particle-duality'],
      difficulty: 'hard',
      subject: 'Physics',
      lastStudied: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      attempts: 8,
      correctAnswers: 4
    },
    {
      id: 'calculus-derivatives',
      name: 'Calculus Derivatives',
      mastery: 92,
      prerequisites: ['limits', 'functions'],
      difficulty: 'medium',
      subject: 'Mathematics',
      lastStudied: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      attempts: 15,
      correctAnswers: 14
    },
    {
      id: 'organic-chemistry',
      name: 'Organic Chemistry',
      mastery: 38,
      prerequisites: ['chemical-bonding', 'molecular-structure'],
      difficulty: 'hard',
      subject: 'Chemistry',
      lastStudied: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      attempts: 6,
      correctAnswers: 2
    }
  ]);

  const [weakAreas, setWeakAreas] = useState<WeakArea[]>([
    { concept: 'Quantum Mechanics', subject: 'Physics', masteryLevel: 45, improvement: -5 },
    { concept: 'Organic Chemistry', subject: 'Chemistry', masteryLevel: 38, improvement: -8 },
    { concept: 'Complex Numbers', subject: 'Mathematics', masteryLevel: 52, improvement: 3 }
  ]);

  const [dailyGoal] = useState({
    target: 60, // minutes
    completed: 45,
    streak: 7
  });

  const getAgeBasedEncouragement = (age: number) => {
    if (age <= 12) return "Amazing work, young scientist! 🌟";
    if (age <= 16) return "Great progress, future scholar! 🚀";
    if (age <= 22) return "Excellent dedication, brilliant mind! 💡";
    return "Outstanding commitment to learning! 🎓";
  };

  const getMasteryColor = (mastery: number) => {
    if (mastery >= 80) return 'from-green-400 to-emerald-600';
    if (mastery >= 60) return 'from-yellow-400 to-orange-500';
    if (mastery >= 40) return 'from-orange-400 to-red-500';
    return 'from-red-400 to-red-600';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header with AI Encouragement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        <Card className="glass backdrop-blur-lg border-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h2 className="text-2xl gradient-text">
                  {getAgeBasedEncouragement(userProfile?.age || 16)}
                </h2>
                <p className="text-muted-foreground">
                  You're on Level {studyStats.level} with {studyStats.xpEarned} XP earned!
                </p>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="px-3 py-1">
                    <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
                    Rank #{studyStats.globalRank.toLocaleString()}
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1">
                    <Flame className="h-4 w-4 mr-1 text-orange-500" />
                    {studyStats.weeklyStreak} Day Streak
                  </Badge>
                </div>
              </div>
              <div className="hidden md:block">
                <RobotCharacter mood="excited" size="lg" isAnimating={true} />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Study Time',
            value: `${Math.floor(studyStats.totalStudyTime / 60)}h ${studyStats.totalStudyTime % 60}m`,
            icon: Clock,
            color: 'text-blue-500',
            trend: '+15%'
          },
          {
            title: 'Concepts Mastered',
            value: `${studyStats.conceptsMastered}/${studyStats.totalConcepts}`,
            icon: Brain,
            color: 'text-purple-500',
            trend: '+8%'
          },
          {
            title: 'XP Earned',
            value: studyStats.xpEarned.toLocaleString(),
            icon: Star,
            color: 'text-yellow-500',
            trend: '+122'
          },
          {
            title: 'Global Rank',
            value: `#${studyStats.globalRank.toLocaleString()}`,
            icon: Trophy,
            color: 'text-orange-500',
            trend: '↑5'
          }
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass hover-lift">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                  </div>
                  <div className="text-right">
                    <metric.icon className={`h-6 w-6 ${metric.color} mb-2`} />
                    <Badge variant="outline" className="text-xs">
                      {metric.trend}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Daily Progress & Level */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Goal */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-500" />
                Daily Study Goal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Progress Today</span>
                <span className="font-medium">{dailyGoal.completed}/{dailyGoal.target} min</span>
              </div>
              <Progress 
                value={(dailyGoal.completed / dailyGoal.target) * 100} 
                className="progress-shimmer"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Keep going! 🔥</span>
                <span>{dailyGoal.target - dailyGoal.completed} min left</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Level Progress */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-500" />
                Level Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Level {studyStats.level}</span>
                <span className="font-medium">
                  {studyStats.xpEarned}/{studyStats.nextLevelXP} XP
                </span>
              </div>
              <Progress 
                value={(studyStats.xpEarned / studyStats.nextLevelXP) * 100}
                className="progress-shimmer"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Next: Level {studyStats.level + 1}</span>
                <span>{studyStats.nextLevelXP - studyStats.xpEarned} XP to go</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Concept Mastery Graph */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5 text-blue-500" />
              Concept Mastery Map
              <Badge variant="outline" className="ml-auto">
                Memory Graph Powered
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {conceptGraph.map((concept, index) => (
                <motion.div
                  key={concept.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-lg glass border hover-lift cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{concept.name}</h4>
                        <p className="text-sm text-muted-foreground">{concept.subject}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getDifficultyColor(concept.difficulty)}`} />
                        <Badge variant="outline" className="text-xs">
                          {concept.mastery}%
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Mastery Level</span>
                        <span>{concept.correctAnswers}/{concept.attempts} correct</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${concept.mastery}%` }}
                          transition={{ delay: 0.8 + index * 0.1, duration: 1 }}
                          className={`h-2 bg-gradient-to-r ${getMasteryColor(concept.mastery)} rounded-full`}
                        />
                      </div>
                    </div>

                    {concept.prerequisites.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        <span>Prerequisites: </span>
                        {concept.prerequisites.map((prereq, i) => (
                          <span key={prereq}>
                            {prereq.replace('-', ' ')}{i < concept.prerequisites.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Weak Areas & Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-red-500" />
              Focus Areas & AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weakAreas.map((area, index) => (
                <motion.div
                  key={area.concept}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg glass border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-red-400 to-orange-500 flex items-center justify-center">
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">{area.concept}</h4>
                      <p className="text-sm text-muted-foreground">{area.subject}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-medium">{area.masteryLevel}%</div>
                      <div className={`text-xs flex items-center gap-1 ${
                        area.improvement >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {area.improvement >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                        {Math.abs(area.improvement)}%
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="hover-lift">
                      <Zap className="h-4 w-4 mr-1" />
                      Boost
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-600 dark:text-blue-400">AI Recommendation</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Focus on Quantum Mechanics fundamentals this week. Complete the prerequisite concepts 
                    first, then tackle 2-3 practice problems daily. Your learning pattern suggests 
                    visual aids will help most.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                      Start Learning Path
                    </Button>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="glass hover-lift cursor-pointer">
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <h4 className="font-medium">Today's Plan</h4>
            <p className="text-sm text-muted-foreground">3 topics scheduled</p>
          </CardContent>
        </Card>
        
        <Card className="glass hover-lift cursor-pointer">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <h4 className="font-medium">Study Groups</h4>
            <p className="text-sm text-muted-foreground">2 active sessions</p>
          </CardContent>
        </Card>
        
        <Card className="glass hover-lift cursor-pointer">
          <CardContent className="p-4 text-center">
            <Activity className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <h4 className="font-medium">Daily Challenge</h4>
            <p className="text-sm text-muted-foreground">Earn 50 XP today</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}