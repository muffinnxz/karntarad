"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Game } from "@/interfaces/Game";
import { Company } from "@/interfaces/Company";
import { Scenario } from "@/interfaces/Scenario";

interface GameComponentProps {
  initialGame?: Game;
  onSave?: (game: Game) => void;
  onExit?: () => void;
}

export default function GameComponent({ initialGame, onSave, onExit }: GameComponentProps) {
  // Initialize game state using the Game interface
  const [game, setGame] = useState<Game>(
    initialGame || {
      id: `game_${Date.now()}`,
      company: {} as Company,
      scenario: {} as Scenario,
      userId: "current_user_id",
      day: 0,
      result: ""
    }
  );

  // Game state management
  const [isLoading, setIsLoading] = useState(false);

  // Advance to the next day
  const handleNextDay = () => {
    setIsLoading(true);

    // Simulate processing
    setTimeout(() => {
      setGame((prevGame) => ({
        ...prevGame,
        day: prevGame.day + 1,
        // In a real implementation, you would update the result based on game logic
        result: prevGame.day >= 5 ? "Game completed!" : `Progressing through day ${prevGame.day + 1}`
      }));
      setIsLoading(false);
    }, 1000);
  };

  // Save current game state
  const handleSaveGame = () => {
    if (onSave) {
      onSave(game);
    }
  };

  // Check if game is complete
  const isGameComplete = game.day >= 5;

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              {game.company.name || "Company"} - {game.scenario.name || "Scenario"}
            </CardTitle>
            <Button variant="outline" onClick={onExit}>
              Exit Game
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Day {game.day}</h3>
            <p className="text-muted-foreground">{game.company.description || "Company description"}</p>
            <p className="mt-2 text-muted-foreground">{game.scenario.description || "Scenario description"}</p>
          </div>

          <div className="p-4 bg-muted rounded-md">
            <h4 className="font-medium mb-2">Current Status</h4>
            <p>{game.result || "Game in progress..."}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleSaveGame}>Save Game</Button>
          <Button onClick={handleNextDay} disabled={isLoading || isGameComplete}>
            {isLoading ? "Processing..." : isGameComplete ? "Game Complete" : "Next Day"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
