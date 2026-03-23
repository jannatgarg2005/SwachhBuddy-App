import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, Play, Book, Award, ArrowRight, Clock, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import WasteSegregationQuiz from "@/components/WasteSegregationQuiz";

interface TrainingProps {
  userData: any;
  onTrainingComplete: (userData: any) => void;
}

const Training = ({ userData, onTrainingComplete }: TrainingProps) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [currentModule, setCurrentModule] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showSegregationQuiz, setShowSegregationQuiz] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const levels = [
    {
      id: 1,
      title: "Basic Waste Management",
      description: "Learn the fundamentals of waste types and segregation",
      modules: [
        { title: "Types of Waste", duration: "5 min", content: "Understanding wet, dry, and hazardous waste categories" },
        { title: "Source Segregation", duration: "8 min", content: "How to properly separate waste at home" },
        { title: "Environmental Impact", duration: "6 min", content: "Why proper waste management matters" },
        { title: "Practical Video Guide", duration: "3 min", content: "Watch a practical demonstration", type: "video" },
        { title: "Interactive Segregation Quiz", duration: "10 min", content: "Test your segregation skills with timed questions", type: "quiz" }
      ],
      quizQuestions: 5
    },
    {
      id: 2,
      title: "Practical Implementation",
      description: "Hands-on skills for effective waste management",
      modules: [
        { title: "Home Segregation Setup", duration: "7 min", content: "Setting up your waste separation system" },
        { title: "Composting Basics", duration: "10 min", content: "Introduction to home composting" },
        { title: "Collection Schedules", duration: "5 min", content: "Understanding local waste collection" }
      ],
      quizQuestions: 5
    },
    {
      id: 3,
      title: userData?.userType === 'employee' ? "Advanced Safety & Operations" : "Community Leadership",
      description: userData?.userType === 'employee' 
        ? "Safety protocols and operational procedures for waste management"
        : "Advanced techniques and community involvement",
      modules: userData?.userType === 'employee' 
        ? [
            { title: "Safety Protocols", duration: "12 min", content: "Personal protective equipment and safety procedures" },
            { title: "Vehicle Operations", duration: "15 min", content: "Operating waste collection vehicles safely" },
            { title: "Reporting Systems", duration: "8 min", content: "Using digital tools for efficient reporting" }
          ]
        : [
            { title: "Community Composting", duration: "10 min", content: "Setting up community composting systems" },
            { title: "Waste Reduction", duration: "8 min", content: "Strategies to minimize waste generation" },
            { title: "Leadership & Education", duration: "7 min", content: "Teaching others about waste management" }
          ],
      quizQuestions: 7
    }
  ];

  const currentLevelData = levels.find(l => l.id === currentLevel);

  // 👇 Auto start video module when opening level 1
  useEffect(() => {
    if (currentLevel === 1 && currentModule === null) {
      const firstVideoIndex = currentLevelData?.modules.findIndex(m => m.type === "video");
      if (firstVideoIndex !== -1) {
        setCurrentModule(firstVideoIndex);
        setProgress(0);
      }
    }
  }, [currentLevel]);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 0.5;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [currentModule]);

  const handleStartModule = (moduleIndex: number) => {
    const module = currentLevelData?.modules[moduleIndex];
    
    if (module?.type === "video") {
      setCurrentModule(moduleIndex);
      setProgress(0);
      setTimeout(() => {
        setCurrentModule(null);
        setProgress(100);
        toast({
          title: "Video Module Completed!",
          description: "Great job! You've watched the practical demonstration.",
        });
      }, 3000);
    } else if (module?.type === "quiz") {
      setShowSegregationQuiz(true);
    } else {
      setCurrentModule(moduleIndex);
      setProgress(0);
      setTimeout(() => {
        setCurrentModule(null);
        setProgress(100);
        toast({
          title: "Module Completed!",
          description: "Great job! You've completed this learning module.",
        });
      }, 3000);
    }
  };

  const handleSegregationQuizComplete = (score: number) => {
    setShowSegregationQuiz(false);
    toast({
      title: "Quiz Completed!",
      description: `Great job! You scored ${score}% on the segregation quiz.`,
    });
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  const handleQuizSubmit = () => {
    const score = Math.floor(Math.random() * 30) + 70;
    setQuizScore(score);
    
    if (score >= 70) {
      const newCompletedLevels = [...completedLevels, currentLevel];
      setCompletedLevels(newCompletedLevels);
      toast({
        title: "Level Completed!",
        description: `Congratulations! You scored ${score}% and passed Level ${currentLevel}.`,
      });

      if (currentLevel < 3) {
        setTimeout(() => {
          setCurrentLevel(currentLevel + 1);
          setQuizScore(null);
          setShowQuiz(false);
        }, 2000);
      } else {
        setTimeout(() => {
          const updatedUserData = {
            ...userData,
            userId: `SBD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            trainingCompleted: true,
            completedAt: new Date().toISOString()
          };
          onTrainingComplete(updatedUserData);
        }, 2000);
      }
    } else {
      toast({
        title: "Try Again",
        description: "You need at least 70% to pass. Please retake the quiz.",
        variant: "destructive",
      });
      setQuizScore(null);
      setShowQuiz(false);
    }
  };

  const overallProgress = ((completedLevels.length + (currentModule !== null ? 0.5 : 0)) / 3) * 100;

  if (showSegregationQuiz) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <WasteSegregationQuiz onComplete={handleSegregationQuizComplete} />
      </div>
    );
  }

  if (currentModule !== null) {
    const module = currentLevelData?.modules[currentModule];
    const isVideoModule = module?.type === "video";
    
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-eco">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">{module?.title}</CardTitle>
            <CardDescription>
              Level {currentLevel} - Module {currentModule + 1}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-8">
              {isVideoModule ? (
                <video 
                  className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                  controls
                  autoPlay
                >
                  <source src="/videos/waste-management-module.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <p className="text-lg text-muted-foreground mb-6">{module?.content}</p>
              )}
              <Progress value={progress} className="mb-4 progress-bar" />
              <p className="text-sm text-muted-foreground">Module Progress: {Math.round(progress)}%</p>
            </div>
            {progress === 100 && (
              <div className="animate-bounce-in">
                <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
                <p className="text-lg font-semibold text-success">Module Completed!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showQuiz) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-eco">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Level {currentLevel} Quiz</CardTitle>
            <CardDescription>
              Answer {currentLevelData?.quizQuestions} questions to complete this level
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            {quizScore === null ? (
              <div>
                <Button variant="eco" size="lg" onClick={handleQuizSubmit} className="animate-pulse">
                  Start Quiz
                </Button>
              </div>
            ) : (
              <div className="animate-scale-in">
                <h3 className="text-2xl font-bold text-success mb-2">Congratulations!</h3>
                <p className="text-lg mb-4">You scored <span className="font-bold text-success">{quizScore}%</span></p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <Badge variant="secondary" className="mb-4">Mandatory Learning Journey</Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome, {userData?.name}!</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Complete all 3 levels to get your unique User ID and access the full platform
          </p>
          <div className="max-w-md mx-auto">
            <Progress value={overallProgress} className="mb-2 progress-bar" />
            <p className="text-sm text-muted-foreground">{completedLevels.length} of 3 levels completed</p>
          </div>
        </div>

        {/* Levels */}
        <div className="space-y-6">
          {levels.map((level) => {
            const isCompleted = completedLevels.includes(level.id);
            const isCurrent = level.id === currentLevel;
            const isLocked = level.id > currentLevel;

            return (
              <Card key={level.id} className={`${isCompleted ? 'bg-success/5 border-success/30' : isCurrent ? 'shadow-eco border-primary/30' : 'opacity-60'}`}>
                <CardHeader>
                  <CardTitle>Level {level.id}: {level.title}</CardTitle>
                  <CardDescription>{level.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Training;
