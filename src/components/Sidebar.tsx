import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { 
  LayoutDashboard,
  Upload,
  Brain,
  BookOpen,
  MessageCircle,
  Trophy,
  Calendar,
  Settings,
  LogOut,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  User,
  ChevronLeft,
  ChevronRight,
  Target,
  TrendingUp,
  Zap,
  GraduationCap
} from 'lucide-react';
import { RobotCharacter } from './RobotCharacter';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
  userProfile: any;
  onLogout: () => void;
}

export function Sidebar({ 
  activeTab, 
  onTabChange, 
  isDarkMode, 
  onThemeToggle,
  userProfile,
  onLogout 
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState([75]);
  const [notifications, setNotifications] = useState(true);

  const mainNavItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'text-blue-500' },
    { id: 'upload', icon: Upload, label: 'Upload Notes', color: 'text-green-500' },
    { id: 'quiz', icon: Brain, label: 'AI Quizzes', color: 'text-purple-500' },
    { id: 'flashcards', icon: BookOpen, label: 'Smart Cards', color: 'text-orange-500' },
    { id: 'tutor', icon: MessageCircle, label: 'AI Tutor', color: 'text-pink-500' },
    { id: 'ranking', icon: Trophy, label: 'Global Rank', color: 'text-yellow-500' },
    { id: 'planner', icon: Calendar, label: 'Study Plan', color: 'text-indigo-500' }
  ];

  const bottomNavItems = [
    { id: 'settings', icon: Settings, label: 'Settings', color: 'text-gray-500' },
    { id: 'logout', icon: LogOut, label: 'Logout', color: 'text-red-500' }
  ];

  const handleNavClick = (id: string) => {
    if (id === 'settings') {
      setShowSettings(true);
    } else if (id === 'logout') {
      onLogout();
    } else {
      onTabChange(id);
    }
  };

  return (
    <>
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed left-0 top-0 h-full bg-card/95 backdrop-blur-lg border-r z-40 transition-all duration-300 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <GraduationCap className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-semibold gradient-text">StudyGenie</span>
                </motion.div>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hover-lift"
              >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* User Profile */}
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 border-b"
            >
              <Card className="glass">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{userProfile?.name || 'User'}</p>
                      <p className="text-xs text-muted-foreground">{userProfile?.grade || 'Student'}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span>Level Progress</span>
                      <span className="text-purple-500">Level 5</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '75%' }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      />
                    </div>
                    <div className="flex gap-1">
                      <Badge variant="secondary" className="text-xs">
                        <Target className="h-3 w-3 mr-1" />
                        750 XP
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        15 Streak
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="space-y-1 px-2">
              {mainNavItems.map((item, index) => (
                <motion.div
                  key={`nav-item-${item.id}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Button
                    variant={activeTab === item.id ? "default" : "ghost"}
                    className={`w-full justify-start gap-3 hover-lift ${
                      activeTab === item.id 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                        : 'hover:bg-white/10'
                    } ${isCollapsed ? 'px-2' : 'px-3'}`}
                    onClick={() => handleNavClick(item.id)}
                  >
                    <item.icon className={`h-4 w-4 ${activeTab === item.id ? 'text-white' : item.color}`} />
                    {!isCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                    
                    {/* Notification badges */}
                    {!isCollapsed && item.id === 'quiz' && (
                      <Badge variant="destructive" className="ml-auto text-xs">
                        3
                      </Badge>
                    )}
                    {!isCollapsed && item.id === 'ranking' && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Zap className="h-3 w-3 text-yellow-500 ml-auto" />
                      </motion.div>
                    )}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Robot Assistant */}
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="p-4 border-t"
            >
              <Card className="glass">
                <CardContent className="p-3 text-center">
                  <RobotCharacter mood="happy" size="sm" isAnimating={true} />
                  <p className="text-xs text-muted-foreground mt-2">
                    Need help? Ask me anything!
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 w-full glass"
                    onClick={() => onTabChange('tutor')}
                  >
                    Chat with AI
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Bottom Navigation */}
          <div className="border-t p-2 space-y-1">
            {bottomNavItems.map((item) => (
              <Button
                key={`bottom-nav-${item.id}`}
                variant="ghost"
                className={`w-full justify-start gap-3 hover-lift ${
                  isCollapsed ? 'px-2' : 'px-3'
                }`}
                onClick={() => handleNavClick(item.id)}
              >
                <item.icon className={`h-4 w-4 ${item.color}`} />
                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="glass backdrop-blur-lg">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold gradient-text">Settings</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSettings(false)}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Theme Settings */}
                    <div className="space-y-3">
                      <h4 className="font-medium">Appearance</h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                          <span className="text-sm">Dark Mode</span>
                        </div>
                        <Switch 
                          checked={isDarkMode}
                          onCheckedChange={onThemeToggle}
                        />
                      </div>
                    </div>

                    {/* Sound Settings */}
                    <div className="space-y-3">
                      <h4 className="font-medium">Audio</h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                          <span className="text-sm">Sound Effects</span>
                        </div>
                        <Switch 
                          checked={soundEnabled}
                          onCheckedChange={setSoundEnabled}
                        />
                      </div>
                      
                      {soundEnabled && (
                        <div className="space-y-2">
                          <label className="text-sm text-muted-foreground">Volume</label>
                          <Slider
                            value={volume}
                            onValueChange={setVolume}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      )}
                    </div>

                    {/* Notification Settings */}
                    <div className="space-y-3">
                      <h4 className="font-medium">Notifications</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Study Reminders</span>
                        <Switch 
                          checked={notifications}
                          onCheckedChange={setNotifications}
                        />
                      </div>
                    </div>

                    {/* My Suggestions */}
                    <div className="space-y-3">
                      <h4 className="font-medium">My Suggestions</h4>
                      <div className="space-y-2">
                        {[
                          "💡 Add more interactive elements for younger learners",
                          "🎯 Include progress celebration animations",
                          "🌟 Create subject-specific robot personalities"
                        ].map((suggestion, index) => (
                          <div key={`suggestion-${index}`} className="p-3 rounded-lg glass">
                            <p className="text-sm">{suggestion}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={() => setShowSettings(false)}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    >
                      Save Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}