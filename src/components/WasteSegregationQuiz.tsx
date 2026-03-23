import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface Question {
  q: string;
  choices: string[];
  answer: number;
}

const QUESTIONS: Question[] = [
  { q: 'Banana peel', choices: ['Wet', 'Dry', 'Hazardous'], answer: 0 },
  { q: 'Plastic bottle', choices: ['Wet', 'Dry', 'Hazardous'], answer: 1 },
  { q: 'Used syringe', choices: ['Wet', 'Dry', 'Hazardous'], answer: 2 },
  { q: 'Newspaper', choices: ['Wet', 'Dry', 'Hazardous'], answer: 1 },
  { q: 'Leftover food', choices: ['Wet', 'Dry', 'Hazardous'], answer: 0 },
  { q: 'Broken glass', choices: ['Wet', 'Dry', 'Hazardous'], answer: 1 },
  { q: 'Expired medicine', choices: ['Wet', 'Dry', 'Hazardous'], answer: 2 },
  { q: 'Cardboard box', choices: ['Wet', 'Dry', 'Hazardous'], answer: 1 },
  { q: 'Vegetable scraps', choices: ['Wet', 'Dry', 'Hazardous'], answer: 0 },
  { q: 'Paint can', choices: ['Wet', 'Dry', 'Hazardous'], answer: 2 }
];

interface WasteSegregationQuizProps {
  onComplete: (score: number) => void;
}

const WasteSegregationQuiz = ({ onComplete }: WasteSegregationQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [quizStarted, setQuizStarted] = useState(false);
  const [answered, setAnswered] = useState(false);

  const resetTimer = useCallback(() => {
    setTimeLeft(10);
  }, []);

  useEffect(() => {
    if (!quizStarted || answered || showResult) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setAnswered(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, answered, showResult, currentQuestion]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (answered) return;
    
    setSelectedAnswer(answerIndex);
    setAnswered(true);
    
    if (answerIndex === QUESTIONS[currentQuestion].answer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setAnswered(false);
      resetTimer();
    } else {
      setShowResult(true);
      const finalScore = Math.round((score / QUESTIONS.length) * 100);
      onComplete(finalScore);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    resetTimer();
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswered(false);
    setQuizStarted(false);
    resetTimer();
  };

  if (!quizStarted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center text-2xl">
              ♻️
            </div>
            <div>
              <CardTitle className="text-xl">Eco-Friendly Waste Segregation Quiz</CardTitle>
              <p className="text-sm text-muted-foreground">Choose the correct bin for each type of waste</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="font-semibold">How to play:</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• There are {QUESTIONS.length} questions about waste segregation</li>
              <li>• Bins: <span className="text-success font-medium">Wet</span>, <span className="text-warning font-medium">Dry</span>, <span className="text-destructive font-medium">Hazardous</span></li>
              <li>• You have <strong>10 seconds</strong> for each question</li>
            </ul>
            <Button onClick={startQuiz} className="w-full">
              Start Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / QUESTIONS.length) * 100);
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="text-4xl font-bold text-primary">
            {score} / {QUESTIONS.length}
          </div>
          <p className="text-muted-foreground">
            You scored {percentage}% — {score} correct answers
          </p>
          <Button onClick={restartQuiz} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const question = QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-muted-foreground">
            Q {currentQuestion + 1} / {QUESTIONS.length}
          </div>
          <div className="flex items-center gap-4">
            <Progress value={progress} className="w-32" />
            <Badge variant={timeLeft <= 3 ? "destructive" : "secondary"}>
              ⏳ {timeLeft}s
            </Badge>
            <div className="text-sm text-muted-foreground">
              Score: {score}
            </div>
          </div>
        </div>
        <CardTitle className="text-lg">{question.q}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-6">
          {question.choices.map((choice, index) => {
            let buttonClass = "w-full p-4 text-left border rounded-lg transition-colors ";
            
            if (answered) {
              if (index === question.answer) {
                buttonClass += "border-success bg-success/10 text-success";
              } else if (index === selectedAnswer && index !== question.answer) {
                buttonClass += "border-destructive bg-destructive/10 text-destructive";
              } else {
                buttonClass += "border-muted bg-muted/10 text-muted-foreground";
              }
            } else {
              buttonClass += "border-muted hover:border-primary hover:bg-primary/5 cursor-pointer";
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={answered}
                className={buttonClass}
              >
                {choice}
              </button>
            );
          })}
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {answered 
              ? selectedAnswer === question.answer 
                ? "Correct ✓" 
                : timeLeft === 0 
                  ? "Time up!" 
                  : "Wrong ✗"
              : "Select the correct bin"
            }
          </div>
          <Button 
            onClick={handleNext}
            disabled={!answered}
            variant="secondary"
          >
            {currentQuestion === QUESTIONS.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WasteSegregationQuiz;