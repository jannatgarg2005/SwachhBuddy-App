import { EcoEscapeRoom } from "@/components/EcoEscapeRoom";
import WasteSortingGame from "@/components/WasteSortingGame";
import { WasteBasicsModule } from "@/components/learning/WasteBasicsModule";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ManageWaste from "@/components/wastegame";
import EcoSorterGame from "@/components/EcoSorterGame";
import EcoRunner from "@/components/EcoRunner"; // ✅ Import new game
import EcoMario from "@/components/EcoMario"; // ✅ Import new game


const Play = () => {
  const navigate = useNavigate();

  const games = [
    { title: "Waste Sorting Game", component: WasteSortingGame },
    { title: "Eco Escape Room", component: EcoEscapeRoom },
    { title: "Eco Word Search", component: ManageWaste },
    { title: "Eco Sorter Training", component: EcoSorterGame },
    { title: "Eco Runner Game", component: EcoRunner },
    { title: "Eco Mario Game", component: EcoMario }, // ✅ Added here
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-green-700">Play & Learn Games</h1>
      <p className="text-muted-foreground">
        Challenge yourself with all available eco-games and improve your waste management skills!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game, index) => (
          <Card key={index} className="hover:scale-105 transition-transform">
            <CardHeader>
              <CardTitle>{game.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => {
                  if (game.title === "Eco Escape Room") navigate("/eco-escape-room");
                  else if (game.title === "Waste Sorting Game") navigate("/learning/waste-sorting-game");
                  else if (game.title === "Eco Word Search") navigate("/manage-waste");
                  else if (game.title === "Eco Sorter Training") navigate("/eco-sorter-game");
                  else if (game.title === "Eco Runner Game") navigate("/eco-runner-game");
                  else if (game.title === "Eco Mario Game") navigate("/eco-mario-game"); // ✅ new route
                  // ✅ new route
                }}
              >
                Play Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Play;
