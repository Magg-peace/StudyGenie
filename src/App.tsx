import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthSystem } from './components/AuthSystem';
import { Sidebar } from './components/Sidebar';
import { EnhancedDashboard } from './components/EnhancedDashboard';
import { FileUpload } from './components/FileUpload';
import { QuizGenerator } from './components/QuizGenerator';
import { FlashcardSystem } from './components/FlashcardSystem';
import { PDFPoweredAITutor } from './components/PDFPoweredAITutor';
import { StudyPlanner } from './components/StudyPlanner';
import { GlobalRanking } from './components/GlobalRanking';
import { Toaster } from './components/ui/sonner';

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

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    // Auto-detect user's theme preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleAuthComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserProfile(null);
    setActiveTab('dashboard');
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Age-based UI adjustments
  const getAgeBasedStyles = () => {
    if (!userProfile?.age) return '';
    if (userProfile.age <= 12) return 'age-young';
    if (userProfile.age <= 18) return 'age-teen';
    return 'age-adult';
  };

  // Show authentication flow if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative">
        {/* Enhanced Animated Background for Auth */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 via-pink-100/30 to-blue-100/30" />
          <div className="absolute inset-0">
            {/* Floating Elements */}
            {Array.from({ length: 50 }, (_, i) => (
              <motion.div
                key={`auth-float-${i}`}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [0, 15, 0],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.2, 1],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 8 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "easeInOut"
                }}
              >
                {['✨', '🌟', '💫', '⭐', '🔮', '💎'][Math.floor(Math.random() * 6)]}
              </motion.div>
            ))}
          </div>
        </div>
        <AuthSystem onAuthComplete={handleAuthComplete} />
      </div>
    );
  }

  // Main application with enhanced design
  return (
    <motion.div 
      className={`min-h-screen flex ${getAgeBasedStyles()}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Dynamic Background Video */}
      <div className="fixed inset-0 -z-20">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-purple-50/90 to-pink-50/95 dark:from-gray-900/95 dark:via-purple-900/90 dark:to-pink-900/95" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {/* Gentle floating elements based on active tab */}
          {Array.from({ length: 20 }, (_, i) => (
            <motion.div
              key={`bg-element-${activeTab}-${i}`}
              className="absolute text-2xl opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                rotate: [0, 5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 15 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut"
              }}
            >
              {getTabEmoji(activeTab)}
            </motion.div>
          ))}
        </div>

        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 opacity-30">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="gentle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.1" />
                <stop offset="25%" stopColor="#EC4899" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.1" />
                <stop offset="75%" stopColor="#10B981" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#gentle-gradient)" />
          </svg>
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isDarkMode={isDarkMode}
        onThemeToggle={handleThemeToggle}
        userProfile={userProfile}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 ml-64 min-h-screen">
        <main className="p-6">
          <AnimatePresence mode="wait">
            {isLoaded && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ 
                  duration: 0.4,
                  ease: [0.4, 0, 0.2, 1]
                }}
              >
                {activeTab === 'dashboard' && (
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center space-y-4"
                    >
                      <h1 className="text-4xl gradient-text magical-float">
                        {getPersonalizedGreeting(userProfile)} ✨
                      </h1>
                      <p className="text-muted-foreground text-lg">
                        Your magical learning journey continues here
                      </p>
                    </motion.div>
                    <EnhancedDashboard userProfile={userProfile} />
                  </div>
                )}

                {activeTab === 'upload' && (
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center space-y-4"
                    >
                      <h1 className="text-4xl gradient-text">Upload Study Materials 📚</h1>
                      <p className="text-muted-foreground text-lg">
                        Upload PDFs, images, or handwritten notes. Our AI will extract concepts and build your personalized knowledge graph.
                      </p>
                      <div className="story-card max-w-2xl mx-auto">
                        <h3 className="text-lg font-medium mb-2">✨ How it works like magic:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="text-center">
                            <div className="text-2xl mb-2">📄</div>
                            <p>Upload your study materials</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl mb-2">🧠</div>
                            <p>AI extracts concepts & builds knowledge graph</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl mb-2">🎯</div>
                            <p>Personalized quizzes & study plans generated</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    <FileUpload />
                  </div>
                )}

                {activeTab === 'quiz' && (
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center space-y-4"
                    >
                      <h1 className="text-4xl gradient-text">AI Quiz Generator 🧠</h1>
                      <p className="text-muted-foreground text-lg">
                        Take adaptive quizzes powered by your concept mastery graph
                      </p>
                    </motion.div>
                    <QuizGenerator />
                  </div>
                )}

                {activeTab === 'flashcards' && (
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center space-y-4"
                    >
                      <h1 className="text-4xl gradient-text">Smart Flashcards 💡</h1>
                      <p className="text-muted-foreground text-lg">
                        Multi-modal flashcards with spaced repetition and mastery tracking
                      </p>
                    </motion.div>
                    <FlashcardSystem />
                  </div>
                )}

                {activeTab === 'tutor' && (
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center space-y-4"
                    >
                      <h1 className="text-4xl gradient-text">AI Study Companion 🤖</h1>
                      <p className="text-muted-foreground text-lg">
                        Get instant help from your multilingual AI companion with cited sources
                      </p>
                    </motion.div>
                    <PDFPoweredAITutor userProfile={userProfile} />
                  </div>
                )}

                {activeTab === 'ranking' && (
                  <div className="space-y-6">
                    <GlobalRanking userProfile={userProfile} />
                  </div>
                )}

                {activeTab === 'planner' && (
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center space-y-4"
                    >
                      <h1 className="text-4xl gradient-text">AI Study Planner 📅</h1>
                      <p className="text-muted-foreground text-lg">
                        AI-powered study planning based on your mastery levels, upcoming exams, and learning patterns.
                      </p>
                    </motion.div>
                    <StudyPlanner userProfile={userProfile} />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Enhanced Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: '#2d3748'
          }
        }}
      />

      {/* Floating Help Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-30"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 2, type: "spring", stiffness: 260, damping: 20 }}
      >
        <div className="relative">
          <motion.button
            className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg flex items-center justify-center text-white hover-lift gentle-pulse"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('tutor')}
          >
            <span className="text-2xl">
              {userProfile?.gender === 'girl' || (userProfile?.age && userProfile.age <= 14) ? '👸🏻' : '🤖'}
            </span>
          </motion.button>
          
          {/* Floating sparkles around help button */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`help-sparkle-${i}`}
              className="absolute text-yellow-400 text-sm pointer-events-none"
              style={{
                top: `${20 + i * 15}%`,
                left: `${20 + i * 20}%`,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Helper functions
function getPersonalizedGreeting(userProfile: UserProfile | null): string {
  if (!userProfile) return "Welcome back";
  
  const age = userProfile.age;
  const name = userProfile.name;
  const isGirl = userProfile.gender === 'girl' || age <= 14;
  
  if (age <= 12) {
    return isGirl 
      ? `Welcome back, Princess ${name}!`
      : `Hey there, Champion ${name}!`;
  } else if (age <= 18) {
    return isGirl
      ? `Hello beautiful ${name}!`
      : `What's up, ${name}!`;
  } else {
    return isGirl
      ? `Welcome back, dear ${name}!`
      : `Hello ${name}!`;
  }
}

function getTabEmoji(tab: string): string {
  const emojis = {
    dashboard: ['📊', '🎯', '⭐', '💎'],
    upload: ['📚', '📄', '📝', '💾'],
    quiz: ['🧠', '❓', '💡', '🎓'],
    flashcards: ['🃏', '📇', '🔄', '⚡'],
    tutor: ['🤖', '💬', '👩‍🏫', '🗣️'],
    ranking: ['🏆', '👑', '🥇', '⭐'],
    planner: ['📅', '⏰', '📋', '🎯']
  };
  
  const tabEmojis = emojis[tab as keyof typeof emojis] || emojis.dashboard;
  return tabEmojis[Math.floor(Math.random() * tabEmojis.length)];
}