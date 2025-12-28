import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { RotateCcw, CheckCircle, XCircle, Brain, Clock } from 'lucide-react';

interface Flashcard {
  id: number;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  nextReview: Date;
  reviewCount: number;
}

interface ReviewSession {
  totalCards: number;
  reviewedCards: number;
  correctAnswers: number;
}

export function FlashcardSystem() {
  const [flashcards] = useState<Flashcard[]>([
    {
      id: 1,
      front: "What is the speed of light in vacuum?",
      back: "c = 3.00 × 10⁸ m/s\n\nThis is a fundamental physical constant that represents the maximum speed at which all energy, matter, and information can travel.",
      difficulty: 'medium',
      nextReview: new Date(),
      reviewCount: 3
    },
    {
      id: 2,
      front: "State Planck's equation for photon energy",
      back: "E = hf\n\nWhere:\n• E = energy of photon\n• h = Planck's constant (6.626 × 10⁻³⁴ J·s)\n• f = frequency of electromagnetic radiation",
      difficulty: 'hard',
      nextReview: new Date(),
      reviewCount: 1
    },
    {
      id: 3,
      front: "What type of waves are electromagnetic waves?",
      back: "Transverse waves\n\nElectromagnetic waves are transverse because the electric and magnetic field oscillations are perpendicular to the direction of wave propagation.",
      difficulty: 'easy',
      nextReview: new Date(),
      reviewCount: 5
    },
    {
      id: 4,
      front: "Write the relationship between wavelength, frequency, and speed of light",
      back: "c = λf\n\nWhere:\n• c = speed of light\n• λ (lambda) = wavelength\n• f = frequency\n\nThis shows that wavelength and frequency are inversely proportional.",
      difficulty: 'medium',
      nextReview: new Date(),
      reviewCount: 2
    }
  ]);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewSession, setReviewSession] = useState<ReviewSession>({
    totalCards: flashcards.length,
    reviewedCards: 0,
    correctAnswers: 0
  });
  const [sessionComplete, setSessionComplete] = useState(false);

  const currentCard = flashcards[currentCardIndex];

  const flipCard = () => {
    setShowAnswer(!showAnswer);
  };

  const markCard = (correct: boolean) => {
    setReviewSession(prev => ({
      ...prev,
      reviewedCards: prev.reviewedCards + 1,
      correctAnswers: prev.correctAnswers + (correct ? 1 : 0)
    }));

    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      setSessionComplete(true);
    }
  };

  const restartSession = () => {
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setReviewSession({
      totalCards: flashcards.length,
      reviewedCards: 0,
      correctAnswers: 0
    });
    setSessionComplete(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (sessionComplete) {
    const accuracy = Math.round((reviewSession.correctAnswers / reviewSession.totalCards) * 100);
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Review Session Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-4xl font-bold">{accuracy}%</div>
            <p>You got {reviewSession.correctAnswers} out of {reviewSession.totalCards} cards correct</p>
            
            <Badge 
              variant={accuracy >= 80 ? "default" : accuracy >= 60 ? "secondary" : "destructive"}
              className="text-sm px-3 py-1"
            >
              {accuracy >= 80 ? "Excellent!" : accuracy >= 60 ? "Good!" : "Keep practicing!"}
            </Badge>
            
            <div className="pt-4">
              <Button onClick={restartSession} className="w-full">
                <RotateCcw className="mr-2 h-4 w-4" />
                Start New Session
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spaced Repetition Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {flashcards.map(card => (
                <div key={card.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{card.front.substring(0, 50)}...</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        <div className={`w-2 h-2 rounded-full ${getDifficultyColor(card.difficulty)} mr-1`} />
                        {card.difficulty}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Reviewed {card.reviewCount} times
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Next: Tomorrow
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

  const progress = (reviewSession.reviewedCards / reviewSession.totalCards) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Progress</span>
            <span className="text-sm">{reviewSession.reviewedCards}/{reviewSession.totalCards}</span>
          </div>
          <Progress value={progress} />
        </CardContent>
      </Card>

      {/* Flashcard */}
      <Card className="min-h-[400px]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Flashcard {currentCardIndex + 1}
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              <div className={`w-2 h-2 rounded-full ${getDifficultyColor(currentCard.difficulty)} mr-1`} />
              {currentCard.difficulty}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div 
            className="min-h-[200px] p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer transition-all hover:border-primary/50"
            onClick={flipCard}
          >
            <div className="h-full flex items-center justify-center text-center">
              {!showAnswer ? (
                <div>
                  <h3 className="text-lg font-medium mb-4">{currentCard.front}</h3>
                  <p className="text-sm text-muted-foreground">Click to reveal answer</p>
                </div>
              ) : (
                <div className="w-full">
                  <div className="text-left whitespace-pre-line">
                    {currentCard.back}
                  </div>
                </div>
              )}
            </div>
          </div>

          {!showAnswer ? (
            <Button onClick={flipCard} className="w-full" variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reveal Answer
            </Button>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={() => markCard(false)} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <XCircle className="h-4 w-4 text-red-500" />
                Incorrect
              </Button>
              <Button 
                onClick={() => markCard(true)}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Correct
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{reviewSession.totalCards}</div>
            <p className="text-sm text-muted-foreground">Total Cards</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{reviewSession.reviewedCards}</div>
            <p className="text-sm text-muted-foreground">Reviewed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{reviewSession.correctAnswers}</div>
            <p className="text-sm text-muted-foreground">Correct</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}