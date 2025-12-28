import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Mail, 
  Lock, 
  User, 
  Calendar, 
  GraduationCap, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Sparkles,
  Brain,
  Globe,
  Heart
} from 'lucide-react';
import { RobotCharacter } from './RobotCharacter';

interface UserProfile {
  name: string;
  email: string;
  age: number;
  grade: string;
  subjects: string[];
  language: string;
  learningStyle: string;
}

interface AuthSystemProps {
  onAuthComplete: (user: UserProfile) => void;
}

export function AuthSystem({ onAuthComplete }: AuthSystemProps) {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'auth' | 'profile' | 'preferences'>('welcome');
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    age: '',
    grade: '',
    subjects: [] as string[],
    language: 'en',
    learningStyle: ''
  });

  const grades = [
    '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade',
    '11th Grade', '12th Grade', 'Undergraduate', 'Graduate', 'Professional'
  ];

  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
    'History', 'Geography', 'Literature', 'Economics', 'Psychology'
  ];

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

  const learningStyles = [
    { id: 'visual', name: 'Visual Learner', icon: '👁️', desc: 'Learn best with images, diagrams, and charts' },
    { id: 'auditory', name: 'Auditory Learner', icon: '👂', desc: 'Learn best through listening and discussion' },
    { id: 'kinesthetic', name: 'Kinesthetic Learner', icon: '✋', desc: 'Learn best through hands-on activities' },
    { id: 'reading', name: 'Reading/Writing', icon: '📚', desc: 'Learn best through reading and writing' }
  ];

  const getAgeBasedGreeting = (age: number) => {
    if (age <= 12) return "Hey there, young explorer! 🌟";
    if (age <= 16) return "Welcome, brilliant student! 🚀";
    if (age <= 22) return "Hello, future leader! 💡";
    return "Greetings, lifelong learner! 🎓";
  };

  const handleAuth = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (authMode === 'signup') {
      setCurrentStep('profile');
    } else if (authMode === 'login') {
      // For demo, complete with default profile
      onAuthComplete({
        name: 'Demo User',
        email: formData.email,
        age: 16,
        grade: '10th Grade',
        subjects: ['Physics', 'Mathematics'],
        language: 'en',
        learningStyle: 'visual'
      });
    } else {
      // Forgot password - show success message
      setAuthMode('login');
    }
    
    setIsLoading(false);
  };

  const handleProfileComplete = () => {
    setCurrentStep('preferences');
  };

  const handlePreferencesComplete = () => {
    const userProfile: UserProfile = {
      name: formData.name,
      email: formData.email,
      age: parseInt(formData.age),
      grade: formData.grade,
      subjects: formData.subjects,
      language: formData.language,
      learningStyle: formData.learningStyle
    };
    
    onAuthComplete(userProfile);
  };

  const toggleSubject = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  // Welcome Screen
  if (currentStep === 'welcome') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-pink-500/20 to-orange-500/20" />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8 relative z-10"
        >
          <motion.div
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <RobotCharacter mood="excited" size="lg" isAnimating={true} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-6xl font-bold gradient-text">StudyGenie</h1>
            <p className="text-xl text-muted-foreground max-w-md mx-auto">
              Your AI-powered personalized study companion that makes learning magical! ✨
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-wrap gap-2 justify-center"
          >
            <Badge variant="secondary" className="text-sm px-3 py-1">
              <Brain className="h-4 w-4 mr-1" />
              AI-Powered Learning
            </Badge>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              <Globe className="h-4 w-4 mr-1" />
              Multilingual Support
            </Badge>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              <Heart className="h-4 w-4 mr-1" />
              Personalized Experience
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <Button
              onClick={() => setCurrentStep('auth')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 text-lg rounded-full hover-lift"
            >
              Start Your Learning Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Authentication Screen
  if (currentStep === 'auth') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-500/20 to-pink-500/20" />
        
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10"
        >
          <Card className="glass backdrop-blur-lg">
            <CardHeader className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <RobotCharacter mood="happy" size="md" isAnimating={false} />
              </motion.div>
              
              <div>
                <CardTitle className="text-2xl gradient-text">
                  {authMode === 'login' && 'Welcome Back!'}
                  {authMode === 'signup' && 'Join StudyGenie'}
                  {authMode === 'forgot' && 'Reset Password'}
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  {authMode === 'login' && 'Sign in to continue your learning journey'}
                  {authMode === 'signup' && 'Create your account to get started'}
                  {authMode === 'forgot' && 'Enter your email to reset password'}
                </p>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {authMode === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="pl-10 glass"
                      />
                    </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10 glass"
                    />
                  </div>
                </motion.div>

                {authMode !== 'forgot' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        className="pl-10 pr-10 glass"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </motion.div>
                )}

                {authMode === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="pl-10 glass"
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  onClick={handleAuth}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white hover-lift"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <>
                      {authMode === 'login' && 'Sign In'}
                      {authMode === 'signup' && 'Create Account'}
                      {authMode === 'forgot' && 'Send Reset Link'}
                    </>
                  )}
                </Button>
              </motion.div>

              <div className="text-center text-sm">
                {authMode === 'login' && (
                  <div className="space-y-2">
                    <button
                      onClick={() => setAuthMode('forgot')}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      Forgot your password?
                    </button>
                    <div>
                      Don't have an account?{' '}
                      <button
                        onClick={() => setAuthMode('signup')}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        Sign up
                      </button>
                    </div>
                  </div>
                )}
                
                {authMode === 'signup' && (
                  <div>
                    Already have an account?{' '}
                    <button
                      onClick={() => setAuthMode('login')}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      Sign in
                    </button>
                  </div>
                )}
                
                {authMode === 'forgot' && (
                  <button
                    onClick={() => setAuthMode('login')}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Back to sign in
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Profile Setup Screen
  if (currentStep === 'profile') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-blue-500/20 to-purple-500/20" />
        
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg relative z-10"
        >
          <Card className="glass backdrop-blur-lg">
            <CardHeader className="text-center">
              <RobotCharacter mood="excited" size="md" isAnimating={true} />
              <CardTitle className="text-2xl gradient-text">Tell Us About Yourself</CardTitle>
              <p className="text-muted-foreground">
                This helps us personalize your learning experience
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter age"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    className="glass"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade/Level</Label>
                  <Select 
                    value={formData.grade} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, grade: value }))}
                  >
                    <SelectTrigger className="glass">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map(grade => (
                        <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Subjects of Interest</Label>
                <div className="grid grid-cols-2 gap-2">
                  {subjects.map(subject => (
                    <motion.div
                      key={subject}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button
                        onClick={() => toggleSubject(subject)}
                        className={`w-full p-2 rounded-lg text-sm transition-all ${
                          formData.subjects.includes(subject)
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                            : 'glass hover:bg-white/20'
                        }`}
                      >
                        {subject}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleProfileComplete}
                disabled={!formData.age || !formData.grade || formData.subjects.length === 0}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white hover-lift"
              >
                Continue to Preferences
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Preferences Screen
  if (currentStep === 'preferences') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-red-500/20 to-pink-500/20" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl relative z-10"
        >
          <Card className="glass backdrop-blur-lg">
            <CardHeader className="text-center">
              <RobotCharacter mood="happy" size="md" isAnimating={true} />
              <CardTitle className="text-2xl gradient-text">
                {formData.age ? getAgeBasedGreeting(parseInt(formData.age)) : "Almost Ready! 🎉"}
              </CardTitle>
              <p className="text-muted-foreground">
                Let's customize your learning experience
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Preferred Language</Label>
                <div className="grid grid-cols-2 gap-2">
                  {languages.map(lang => (
                    <motion.div
                      key={lang.code}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, language: lang.code }))}
                        className={`w-full p-3 rounded-lg text-sm flex items-center gap-2 transition-all ${
                          formData.language === lang.code
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                            : 'glass hover:bg-white/20'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Learning Style</Label>
                <div className="grid grid-cols-1 gap-3">
                  {learningStyles.map(style => (
                    <motion.div
                      key={style.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, learningStyle: style.id }))}
                        className={`w-full p-4 rounded-lg text-left transition-all ${
                          formData.learningStyle === style.id
                            ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                            : 'glass hover:bg-white/20'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{style.icon}</span>
                          <div>
                            <h4 className="font-medium">{style.name}</h4>
                            <p className="text-sm opacity-80">{style.desc}</p>
                          </div>
                        </div>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>

              <Button
                onClick={handlePreferencesComplete}
                disabled={!formData.language || !formData.learningStyle}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white hover-lift"
              >
                Complete Setup & Start Learning
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return null;
}