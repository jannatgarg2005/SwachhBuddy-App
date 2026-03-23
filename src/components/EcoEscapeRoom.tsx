import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Question {
  q: string;
  opts: string[];
  ans: number;
}

const questions: Question[] = [
  { q: "Coconut shell after drinking water — which bin?", opts: ["Wet", "Dry", "Hazardous"], ans: 1 },
  { q: "Leftover curry with gravy — where does it go?", opts: ["Wet", "Dry", "Hazardous"], ans: 0 },
  { q: "Cracked ceramic coffee mug — where to dispose?", opts: ["Wet", "Dry", "Hazardous"], ans: 1 },
  { q: "Empty pesticide bottles (plastic) — correct bin?", opts: ["Wet", "Dry", "Hazardous"], ans: 2 },
  { q: "Ash from burnt wood in a fireplace — which bin?", opts: ["Wet", "Dry", "Hazardous"], ans: 1 },
  { q: "Used aluminium foil (with slight food stains) — correct bin?", opts: ["Wet", "Dry", "Hazardous"], ans: 1 },
  { q: "Expired paracetamol tablets — disposal?", opts: ["Wet", "Dry", "Hazardous"], ans: 2 },
  { q: "E-waste: old mobile charger cable — where?", opts: ["Wet", "Dry", "Hazardous"], ans: 2 },
  { q: "Ink cartridge from printer — which bin?", opts: ["Wet", "Dry", "Hazardous"], ans: 2 },
  { q: "Broken mirror pieces — which bin?", opts: ["Wet", "Dry", "Hazardous"], ans: 1 }
];

export const EcoEscapeRoom = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [score, setScore] = useState(0);
  const [unlockedRooms, setUnlockedRooms] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<number | null>(null);
  const [roomStates, setRoomStates] = useState<boolean[]>(new Array(10).fill(false));

  const startGame = () => {
    setGameStarted(true);
    setGameEnded(false);
    setScore(0);
    setUnlockedRooms(0);
    setCurrentQuestion(null);
    setRoomStates(new Array(10).fill(false));
  };

  const askQuestion = (roomIndex: number) => {
    if (roomStates[roomIndex]) return;
    setCurrentQuestion(roomIndex);
  };

  const checkAnswer = (choice: number) => {
    if (currentQuestion === null) return;
    
    const question = questions[currentQuestion];
    if (choice === question.ans) {
      setScore(prev => prev + 1);
      setUnlockedRooms(prev => prev + 1);
      setRoomStates(prev => {
        const newStates = [...prev];
        newStates[currentQuestion] = true;
        return newStates;
      });
      toast.success("🔓 Room unlocked! Great job!");
      setCurrentQuestion(null);
      
      if (unlockedRooms + 1 === 10) {
        setTimeout(() => {
          setGameEnded(true);
          setGameStarted(false);
        }, 1000);
      }
    } else {
      setScore(prev => prev - 1);
      toast.error("❌ Wrong! Try again.");
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameEnded(false);
    setScore(0);
    setUnlockedRooms(0);
    setCurrentQuestion(null);
    setRoomStates(new Array(10).fill(false));
  };

  if (!gameStarted && !gameEnded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-3xl text-primary">♻ Eco Escape Room</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Unlock all 10 rooms by answering advanced waste segregation questions!  
              Each room starts <b>locked 🔒</b>. Answer correctly to unlock it 🔓.  
              Wrong answers = room stays locked (try again).
            </p>
            <Button onClick={startGame} className="w-full">
              Start Game
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameEnded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-3xl text-primary">🎉 You Escaped!</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="text-2xl">Your final score: {score}/10</p>
            <div className="space-x-4">
              <Button onClick={resetGame}>Play Again</Button>
              <Button variant="outline" onClick={() => navigate('/learning')}>
                Back to Learning
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-accent/50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary">Eco Escape Room</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-5 gap-4 mb-6">
              {Array.from({ length: 10 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => askQuestion(i)}
                  className={`aspect-square rounded-lg border-2 flex items-center justify-center text-4xl transition-all duration-300 hover:scale-105 ${
                    roomStates[i]
                      ? 'bg-green-100 border-green-400 text-green-600'
                      : 'bg-red-100 border-red-400 text-red-600 cursor-pointer'
                  }`}
                >
                  {roomStates[i] ? '🔓' : '🔒'}
                </button>
              ))}
            </div>

            <div className="flex justify-center">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Score: {score} | Unlocked: {unlockedRooms}/10
              </Badge>
            </div>
          </CardContent>
        </Card>

        {currentQuestion !== null && (
          <Card>
            <CardHeader>
              <CardTitle>Room {currentQuestion + 1} Question</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg font-medium">{questions[currentQuestion].q}</p>
              <div className="space-y-2">
                {questions[currentQuestion].opts.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto p-4 hover:bg-accent"
                    onClick={() => checkAnswer(index)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};