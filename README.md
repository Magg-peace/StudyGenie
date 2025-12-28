# 🧞‍♂️ StudyGenie - AI-Powered Study Assistant

<div align="center">

![StudyGenie Banner](https://img.shields.io/badge/StudyGenie-AI%20Study%20Assistant-8B5CF6?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTUuMDkgOC4yNkwyMiA5LjI3TDE3IDEzLjE0TDE4LjE4IDIxTDEyIDE3LjI3TDUuODIgMjFMNyAxMy4xNEwyIDkuMjdMOC45MSA4LjI2TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4=)

**Transform your learning experience with AI-powered study tools**

[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)

</div>

---

## ✨ Features

### 📚 **Smart Study Tools**
- **PDF Upload & Analysis** - Upload study materials and get instant AI-powered insights
- **AI Tutor** - Interactive AI assistant with personalized guidance (Princess 👸🏻 or Robot 🤖 avatars)
- **Quiz Generator** - Auto-generate quizzes from your study materials
- **Flashcard System** - Create and review flashcards with spaced repetition
- **Study Planner** - Organize your study schedule efficiently

### 🎯 **Personalized Experience**
- **User Profiles** - Customized learning based on age, grade, and learning style
- **Age-Adaptive UI** - Interface adjusts for young learners (≤12), teens (≤18), and adults
- **Gender-Based Avatars** - Choose between Princess and Robot AI tutors
- **Dark Mode** - Eye-friendly dark theme with auto-detection
- **Multi-Language Support** - Study in your preferred language

### 📊 **Progress Tracking**
- **Interactive Dashboard** - Visual insights into your learning progress
- **Global Ranking** - Compete with learners worldwide
- **Study Statistics** - Track study time, quiz scores, and flashcard mastery
- **Achievement System** - Unlock badges and rewards as you learn

### 🎨 **Beautiful Design**
- **Glassmorphism UI** - Modern, elegant interface with blur effects
- **Smooth Animations** - Delightful transitions powered by Framer Motion
- **Responsive Design** - Perfect experience on desktop, tablet, and mobile
- **Gradient Themes** - Eye-catching purple, pink, and blue color schemes

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Magg-peace/StudyGenie.git
   cd StudyGenie
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   ```
   Navigate to http://localhost:5173
   ```

### Build for Production

```bash
npm run build
# or
yarn build
```

The optimized production build will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

---

## 🛠️ Tech Stack

### **Frontend Framework**
- **React 18.3.1** - UI library with hooks and functional components
- **TypeScript** - Type-safe JavaScript
- **Vite** - Lightning-fast build tool and dev server

### **Styling**
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible component primitives
- **Framer Motion** - Production-ready animation library
- **Class Variance Authority** - CSS utility management
- **Lucide React** - Beautiful icon set

### **UI Components**
- Custom component library built on Radix UI
- Accordion, Dialog, Dropdown, Tabs, Tooltips, and more
- Fully accessible and keyboard-navigable
- Form components with React Hook Form integration

### **Data Visualization**
- **Recharts** - Composable charting library
- Interactive charts for study analytics

### **State Management**
- React hooks (useState, useEffect, useContext)
- Local component state management

---

## 📁 Project Structure

```
StudyGenie/
├── src/
│   ├── components/           # React components
│   │   ├── ui/              # Reusable UI components
│   │   ├── AuthSystem.tsx   # Authentication flow
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── FileUpload.tsx   # PDF upload interface
│   │   ├── QuizGenerator.tsx
│   │   ├── FlashcardSystem.tsx
│   │   ├── PDFPoweredAITutor.tsx
│   │   ├── StudyPlanner.tsx
│   │   └── GlobalRanking.tsx
│   ├── styles/              # Global styles
│   ├── guidelines/          # Development guidelines
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # App entry point
│   └── index.css           # Global CSS
├── public/                 # Static assets
├── index.html             # HTML template
├── package.json           # Dependencies
├── tsconfig.json         # TypeScript config
├── vite.config.ts        # Vite configuration
└── tailwind.config.js    # Tailwind configuration
```

---

## 🎯 Usage Guide

### 1️⃣ **First Time Setup**
- Launch the app and complete the onboarding form
- Enter your name, email, age, grade, and subjects
- Choose your learning style and preferred language
- Select your avatar preference (Princess or Robot)

### 2️⃣ **Upload Study Materials**
- Navigate to the "Upload" tab
- Drag and drop PDF files or click to browse
- Wait for AI analysis to complete
- View extracted insights and summaries

### 3️⃣ **Use AI Tutor**
- Click the floating tutor button (bottom-right)
- Ask questions about your uploaded materials
- Get personalized explanations and help
- Switch between Princess and Robot avatars

### 4️⃣ **Generate Quizzes**
- Go to "Quiz Generator" tab
- Select difficulty level and number of questions
- Take auto-generated quizzes from your materials
- Review answers and explanations

### 5️⃣ **Create Flashcards**
- Navigate to "Flashcards" section
- Create custom flashcards or auto-generate from PDFs
- Use spaced repetition for effective memorization
- Track your mastery progress

### 6️⃣ **Plan Your Studies**
- Open "Study Planner"
- Create study sessions and set goals
- Get AI-powered schedule recommendations
- Track completion and adjust as needed

---

## 🌟 Key Features Explained

### **Adaptive Learning**
StudyGenie adjusts its interface and content based on:
- **Age** - Simpler UI for younger students, advanced features for adults
- **Grade Level** - Content difficulty matches your education level
- **Learning Style** - Visual, auditory, kinesthetic, or reading/writing preferences

### **AI-Powered Intelligence**
- Smart content extraction from PDFs
- Context-aware question generation
- Personalized study recommendations
- Natural language conversation with AI tutor

### **Gamification Elements**
- Global leaderboard and rankings
- Achievement badges and rewards
- Progress tracking and statistics
- Study streaks and milestones

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style
- Write TypeScript with proper types
- Ensure components are accessible
- Test on multiple screen sizes
- Add comments for complex logic

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Radix UI** - For accessible component primitives
- **Shadcn/ui** - For component design inspiration
- **Framer Motion** - For smooth animations
- **Lucide Icons** - For beautiful icons
- **Tailwind CSS** - For rapid styling

---

## 📧 Contact

**Project Maintainer** - [@Magg-peace](https://github.com/Magg-peace)

**Project Link** - [https://github.com/Magg-peace/StudyGenie](https://github.com/Magg-peace/StudyGenie)

---

<div align="center">

**Made with 💜 by developers who love learning**

⭐ Star this repo if you find it helpful!

</div>