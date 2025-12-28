import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { BookOpen, Brain, Upload, BarChart3, Target, Flame } from 'lucide-react';

interface StudyStats {
  totalQuizzes: number;
  completedQuizzes: number;
  flashcardsReviewed: number;
  studyStreak: number;
  weeklyGoal: number;
  weeklyProgress: number;
}

interface Subject {
  name: string;
  strength: number;
  color: string;
}

export function Dashboard() {
  const [stats] = useState<StudyStats>({
    totalQuizzes: 25,
    completedQuizzes: 18,
    flashcardsReviewed: 142,
    studyStreak: 7,
    weeklyGoal: 200,
    weeklyProgress: 142
  });

  const [subjects] = useState<Subject[]>([
    { name: 'Physics', strength: 75, color: 'bg-blue-500' },
    { name: 'Mathematics', strength: 90, color: 'bg-green-500' },
    { name: 'Chemistry', strength: 60, color: 'bg-orange-500' },
    { name: 'Biology', strength: 85, color: 'bg-purple-500' }
  ]);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Quizzes</p>
                <p className="font-medium">{stats.completedQuizzes}/{stats.totalQuizzes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Flashcards</p>
                <p className="font-medium">{stats.flashcardsReviewed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Study Streak</p>
                <p className="font-medium">{stats.studyStreak} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Weekly Goal</p>
                <p className="font-medium">{stats.weeklyProgress}/{stats.weeklyGoal}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Flashcards Reviewed</span>
              <span>{stats.weeklyProgress}/{stats.weeklyGoal}</span>
            </div>
            <Progress value={(stats.weeklyProgress / stats.weeklyGoal) * 100} />
          </div>
        </CardContent>
      </Card>

      {/* Knowledge Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Knowledge Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {subjects.map((subject) => (
              <div key={subject.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">{subject.name}</span>
                  <Badge variant={subject.strength >= 80 ? "default" : subject.strength >= 60 ? "secondary" : "destructive"}>
                    {subject.strength}%
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${subject.color}`}
                      style={{ width: `${subject.strength}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}