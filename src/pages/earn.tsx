import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Earn = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-green-700">Earn Rewards</h1>
      <p className="text-muted-foreground">
        Learn how participating in our eco-friendly model can earn you points and rewards.
      </p>

      <Button
        className="bg-green-600 hover:bg-green-700 text-white"
        onClick={() => navigate("/rewards")}
      >
        Go to Rewards
      </Button>
    </div>
  );
};

export default Earn;