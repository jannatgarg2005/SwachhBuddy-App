import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Gamepad2, 
  Target, 
  Zap, 
  Trophy, 
  Users, 
  Clock, 
  Star,
  Play,
  Award,
  Puzzle,
  Home,
  Lock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const LearningGames = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const games = [
    {
      id: 'sorting-challenge',
      title: 'Waste Sorting Challenge',
      description: 'Drag and drop waste items into correct bins within time limit',
      difficulty: 'Easy',
      duration: '5 mins',
      points: 50,
      players: 1248,
      rating: 4.7,
      icon: Target,
      category: 'Sorting'
    },
    {
      id: 'recycling-quiz',
      title: 'Recycling Quiz Master',
      description: 'Test your knowledge about recyclable materials and processes',
      difficulty: 'Medium',
      duration: '10 mins',
      points: 75,
      players: 892,
      rating: 4.5,
      icon: Puzzle,
      category: 'Knowledge'
    },
    {
      id: 'eco-hero',
      title: 'Eco Hero Adventure',
      description: 'Navigate through the city cleaning up waste and earning rewards',
      difficulty: 'Medium',
      duration: '15 mins',
      points: 100,
      players: 1563,
      rating: 4.8,
      icon: Zap,
      category: 'Adventure'
    },
    {
      id: 'memory-match',
      title: 'Waste Memory Match',
      description: 'Match waste items with their correct disposal methods',
      difficulty: 'Easy',
      duration: '7 mins',
      points: 60,
      players: 756,
      rating: 4.3,
      icon: Target,
      category: 'Memory'
    },
    {
      id: 'composting-sim',
      title: 'Composting Simulator',
      description: 'Learn composting by managing your own virtual compost bin',
      difficulty: 'Hard',
      duration: '20 mins',
      points: 150,
      players: 423,
      rating: 4.9,
      icon: Trophy,
      category: 'Simulation'
    },
    {
      id: 'team-cleanup',
      title: 'Team Cleanup Challenge',
      description: 'Collaborate with others to organize city-wide cleaning missions',
      difficulty: 'Medium',
      duration: '25 mins',
      points: 200,
      players: 1789,
      rating: 4.6,
      icon: Users,
      category: 'Multiplayer'
    },
    {
      id: 'eco-escape-room',
      title: 'Eco Escape Room',
      description: 'Unlock all 10 rooms by answering advanced waste segregation questions',
      difficulty: 'Hard',
      duration: '30 mins',
      points: 300,
      players: 325,
      rating: 4.9,
      icon: Lock,
      category: 'Knowledge'
    }
  ];

  const categories = ['All', 'Sorting', 'Knowledge', 'Adventure', 'Memory', 'Simulation', 'Multiplayer'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredGames = selectedCategory === 'All' 
    ? games 
    : games.filter(game => game.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500'; 
      case 'Hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handlePlayGame = (gameId: string, gameTitle: string) => {
    if (gameId === 'eco-escape-room') {
      navigate('/eco-escape-room');
    } else {
      toast({
        title: "Game Starting!",
        description: `Loading ${gameTitle}... Get ready to learn and earn points!`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="text-center flex-1">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Gamepad2 className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">Learning Games</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn waste management through fun, interactive games and earn points while you play!
          </p>
        </div>
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

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">12</div>
            <div className="text-sm text-muted-foreground">Games Played</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">850</div>
            <div className="text-sm text-muted-foreground">Points Earned</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">5</div>
            <div className="text-sm text-muted-foreground">Achievements</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">#23</div>
            <div className="text-sm text-muted-foreground">Leaderboard Rank</div>
          </CardContent>
        </Card>
      </div>

      {/* Games Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredGames.map((game) => {
          const IconComponent = game.icon;
          return (
            <Card key={game.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className={getDifficultyColor(game.difficulty)}>
                    {game.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{game.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{game.title}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {game.category}
                    </Badge>
                  </div>
                </div>
                
                <CardDescription>{game.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{game.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{game.players}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-primary">
                        {game.points} pts
                      </span>
                    </div>
                    <Button 
                      onClick={() => handlePlayGame(game.id, game.title)}
                      size="sm"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Play Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Achievement Showcase */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Weekly Gaming Challenge</h3>
                <p className="text-sm text-muted-foreground">
                  Play 5 different games this week to earn the "Game Master" badge!
                </p>
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>3/5 games</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningGames;