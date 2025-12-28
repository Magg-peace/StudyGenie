import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Flame, 
  Target, 
  Clock,
  Zap,
  Star,
  TrendingUp,
  Users,
  Calendar,
  Brain,
  Play,
  Award,
  Globe
} from 'lucide-react';
import { RobotCharacter } from './RobotCharacter';

interface RankingUser {
  id: string;
  name: string;
  avatar: string;
  rank: number;
  xp: number;
  streak: number;
  level: number;
  country: string;
  subjects: string[];
  todaysSolved: number;
  totalSolved: number;
}

interface DailyChallenge {
  id: string;
  title: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  timeLimit: number;
  description: string;
  totalAttempts: number;
  successRate: number;
  isCompleted: boolean;
}

export function GlobalRanking({ userProfile }: { userProfile: any }) {
  const [activeTab, setActiveTab] = useState('global');
  const [selectedTimeframe, setSelectedTimeframe] = useState('weekly');
  const [challengeStarted, setChallengeStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes

  const [leaderboard, setLeaderboard] = useState<RankingUser[]>([
    {
      id: 'user-1',
      name: 'Arjun Sharma',
      avatar: '🧑‍💻',
      rank: 1,
      xp: 15420,
      streak: 47,
      level: 12,
      country: '🇮🇳',
      subjects: ['Physics', 'Mathematics'],
      todaysSolved: 8,
      totalSolved: 324
    },
    {
      id: 'user-2',
      name: 'Priya Patel',
      avatar: '👩‍🔬',
      rank: 2,
      xp: 14890,
      streak: 38,
      level: 11,
      country: '🇮🇳',
      subjects: ['Chemistry', 'Biology'],
      todaysSolved: 6,
      totalSolved: 298
    },
    {
      id: 'user-3',
      name: 'Rohan Singh',
      avatar: '🧑‍🎓',
      rank: 3,
      xp: 14256,
      streak: 29,
      level: 11,
      country: '🇮🇳',
      subjects: ['Mathematics', 'Computer Science'],
      todaysSolved: 7,
      totalSolved: 289
    },
    // Add current user
    {
      id: 'current-user',
      name: userProfile?.name || 'You',
      avatar: '🤓',
      rank: 1247,
      xp: 2840,
      streak: 12,
      level: 8,
      country: '🇮🇳',
      subjects: userProfile?.subjects || ['Physics'],
      todaysSolved: 3,
      totalSolved: 67
    }
  ]);

  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([
    {
      id: 'challenge-1',
      title: 'Electromagnetic Spectrum Master',
      subject: 'Physics',
      difficulty: 'medium',
      xpReward: 150,
      timeLimit: 600,
      description: 'Test your knowledge of electromagnetic waves, frequency ranges, and applications',
      totalAttempts: 1250,
      successRate: 67,
      isCompleted: false
    },
    {
      id: 'challenge-2',
      title: 'Calculus Chain Rule Challenge',
      subject: 'Mathematics',
      difficulty: 'hard',
      xpReward: 200,
      timeLimit: 900,
      description: 'Master complex derivative problems using chain rule',
      totalAttempts: 890,
      successRate: 43,
      isCompleted: false
    },
    {
      id: 'challenge-3',
      title: 'Organic Reactions Quiz',
      subject: 'Chemistry',
      difficulty: 'easy',
      xpReward: 100,
      timeLimit: 300,
      description: 'Quick review of basic organic chemistry reactions',
      totalAttempts: 2100,
      successRate: 78,
      isCompleted: true
    }
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (challengeStarted && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [challengeStarted, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'from-green-400 to-green-600';
      case 'medium': return 'from-yellow-400 to-orange-500';
      case 'hard': return 'from-red-400 to-red-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="text-sm font-bold">#{rank}</span>;
  };

  const startChallenge = (challenge: DailyChallenge) => {
    setChallengeStarted(true);
    setTimeRemaining(challenge.timeLimit);
    // Simulate challenge start
  };

  const FlagIcon = ({ className }: { className: string }) => (
    <div className={className}>🇮🇳</div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <h2 className="text-3xl gradient-text">Global Championship</h2>
          <Trophy className="h-8 w-8 text-yellow-500" />
        </div>
        <p className="text-muted-foreground">
          Compete with students worldwide in daily challenges and climb the leaderboard!
        </p>
        <div className="flex justify-center">
          <RobotCharacter mood="excited" size="md" isAnimating={true} />
        </div>
      </motion.div>

      {/* Daily Challenges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              Daily Challenges
              <Badge variant="outline" className="ml-auto">
                <Clock className="h-3 w-3 mr-1" />
                Resets in 8h 24m
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dailyChallenges.map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-lg border relative overflow-hidden ${
                    challenge.isCompleted 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'glass border-white/10'
                  }`}
                >
                  {challenge.isCompleted && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-green-500 text-white">
                        <Award className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium">{challenge.title}</h4>
                      <p className="text-sm text-muted-foreground">{challenge.subject}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`bg-gradient-to-r ${getDifficultyColor(challenge.difficulty)} text-white border-0`}
                      >
                        {challenge.difficulty.toUpperCase()}
                      </Badge>
                      <Badge variant="secondary">
                        <Star className="h-3 w-3 mr-1" />
                        {challenge.xpReward} XP
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {challenge.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{challenge.totalAttempts.toLocaleString()} attempts</span>
                      <span>{challenge.successRate}% success rate</span>
                    </div>

                    <Button
                      onClick={() => startChallenge(challenge)}
                      disabled={challenge.isCompleted}
                      className={`w-full ${
                        challenge.isCompleted 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                      }`}
                    >
                      {challenge.isCompleted ? (
                        <>
                          <Award className="h-4 w-4 mr-2" />
                          Completed
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Start Challenge
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              Global Leaderboard
            </CardTitle>
            <div className="flex gap-2">
              {['weekly', 'monthly', 'all-time'].map((timeframe) => (
                <Button
                  key={`timeframe-${timeframe}`}
                  variant={selectedTimeframe === timeframe ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className="capitalize"
                >
                  {timeframe.replace('-', ' ')}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="global">Global</TabsTrigger>
                <TabsTrigger value="country">India 🇮🇳</TabsTrigger>
                <TabsTrigger value="friends">Friends</TabsTrigger>
              </TabsList>

              <TabsContent value="global" className="mt-6">
                <div className="space-y-3">
                  {leaderboard.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className={`flex items-center gap-4 p-4 rounded-lg border hover-lift ${
                        user.id === 'current-user' 
                          ? 'bg-blue-500/10 border-blue-500/30' 
                          : 'glass border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-600">
                          {getRankIcon(user.rank)}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{user.avatar}</span>
                          <span className="text-xl">{user.country}</span>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{user.name}</h4>
                            {user.id === 'current-user' && (
                              <Badge variant="secondary" className="text-xs">You</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>Level {user.level}</span>
                            <span>•</span>
                            <span>{user.totalSolved} solved</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Flame className="h-3 w-3 text-orange-500" />
                              <span>{user.streak}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-medium text-lg">{user.xp.toLocaleString()} XP</div>
                        <div className="text-sm text-muted-foreground">
                          +{user.todaysSolved} today
                        </div>
                      </div>

                      {index < 3 && (
                        <motion.div
                          animate={{ 
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity,
                            delay: index * 0.3
                          }}
                        >
                          {index === 0 && <Crown className="h-6 w-6 text-yellow-500" />}
                          {index === 1 && <Medal className="h-6 w-6 text-gray-400" />}
                          {index === 2 && <Medal className="h-6 w-6 text-amber-600" />}
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="country" className="mt-6">
                <div className="text-center py-8">
                  <FlagIcon className="h-16 w-16 mx-auto mb-4 text-orange-500" />
                  <h3 className="text-lg font-medium">India Leaderboard</h3>
                  <p className="text-muted-foreground">
                    Compete with fellow Indian students
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="friends" className="mt-6">
                <div className="text-center py-8">
                  <Users className="h-16 w-16 mx-auto mb-4 text-purple-500" />
                  <h3 className="text-lg font-medium">Friends Leaderboard</h3>
                  <p className="text-muted-foreground">
                    Connect with friends to see their progress
                  </p>
                  <Button className="mt-4">
                    Invite Friends
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Personal Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {[
          { icon: Target, color: 'text-green-500', title: "Today's Goal", value: '3/5', desc: 'Challenges completed' },
          { icon: TrendingUp, color: 'text-blue-500', title: 'This Week', value: '+127', desc: 'Rank improvement' },
          { icon: Zap, color: 'text-yellow-500', title: 'Next Milestone', value: 'Top 1000', desc: '247 ranks to go' }
        ].map((stat, index) => (
          <Card key={`stat-${index}`} className="glass">
            <CardContent className="p-4 text-center">
              <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-2`} />
              <h4 className="font-medium">{stat.title}</h4>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.desc}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Challenge Timer Modal */}
      <AnimatePresence>
        {challengeStarted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-2xl"
            >
              <Card className="glass backdrop-blur-lg">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Brain className="h-6 w-6 text-purple-500" />
                    Daily Challenge in Progress
                  </CardTitle>
                  <div className="text-3xl font-bold text-red-500">
                    {formatTime(timeRemaining)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-medium mb-2">
                      Electromagnetic Spectrum Master
                    </h3>
                    <p className="text-muted-foreground">
                      Question 1 of 10
                    </p>
                  </div>

                  <Progress value={10} />

                  <div className="p-6 rounded-lg glass border">
                    <h4 className="font-medium mb-4">
                      Which electromagnetic wave has the highest frequency?
                    </h4>
                    <div className="space-y-2">
                      {['Radio waves', 'Gamma rays', 'X-rays', 'Visible light'].map((option, index) => (
                        <Button
                          key={`option-${index}`}
                          variant="outline"
                          className="w-full justify-start hover-lift"
                        >
                          {String.fromCharCode(65 + index)}. {option}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setChallengeStarted(false)}
                    >
                      Exit Challenge
                    </Button>
                    <Button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500">
                      Next Question
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}