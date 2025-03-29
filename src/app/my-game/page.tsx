"use client";

import React, { useState } from "react";
// Next.js components
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
// Icons
import { ArrowLeft, Calendar, Trash2, X } from "lucide-react";
// Custom components
import CompanySelector from "@/components/my-game/CompanySelector";
import ScenarioSelector from "@/components/my-game/ScenarioSelector";
// Types
import { Company } from "@/interfaces/Company";
import { Scenario } from "@/interfaces/Scenario";
import { Game } from "@/interfaces/Game";

// Sample data using the Game interface
const savedGames: Game[] = [
  {
    id: "1",
    company: {
      id: "c1",
      userId: "user_1",
      name: "Acme Marketing",
      description: "Digital marketing agency specializing in growth strategies",
      companyProfileURL: "/placeholder/company-profile.svg",
      isPublic: true,
      createdAt: new Date()
    },
    scenario: {
      id: "s1",
      userId: "user_1",
      name: "Product Launch",
      description: "Launch a new product in a competitive market",
      isPublic: true,
      createdAt: new Date()
    },
    userId: "user_1",
    day: 0,
    result: "Game in progress",
    characterList: []
  },
  {
    id: "2",
    company: {
      id: "c2",
      userId: "user_1",
      name: "TechVision",
      description: "Software development company focused on AI solutions",
      companyProfileURL: "/placeholder/company-profile.svg",
      isPublic: true,
      createdAt: new Date()
    },
    scenario: {
      id: "s2",
      userId: "user_1",
      name: "Market Research",
      description: "Conduct market research for a new product line",
      isPublic: true,
      createdAt: new Date()
    },
    userId: "user_1",
    day: 2,
    result: "Completed market analysis",
    characterList: []
  },
  {
    id: "3",
    company: {
      id: "c3",
      userId: "user_1",
      name: "Global Solutions",
      description: "International consulting firm for business transformation",
      companyProfileURL: "/placeholder/company-profile.svg",
      isPublic: true,
      createdAt: new Date()
    },
    scenario: {
      id: "s3",
      userId: "user_1",
      name: "Client Negotiation",
      description: "Negotiate a major contract with a potential client",
      isPublic: true,
      createdAt: new Date()
    },
    userId: "user_1",
    day: 1,
    result: "Initial client meeting completed",
    characterList: []
  },
  {
    id: "4",
    company: {
      id: "c4",
      userId: "user_1",
      name: "Innovate Health",
      description: "Healthcare technology provider improving patient outcomes",
      companyProfileURL: "/placeholder/company-profile.svg",
      isPublic: true,
      createdAt: new Date()
    },
    scenario: {
      id: "s4",
      userId: "user_1",
      name: "Expansion Planning",
      description: "Plan expansion into new markets",
      isPublic: true,
      createdAt: new Date()
    },
    userId: "user_1",
    day: 3,
    result: "Expansion strategy drafted",
    characterList: []
  }
];

export default function LoadGameScreen() {
  const router = useRouter();
  
  // UI state
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  const [showNewGameModal, setShowNewGameModal] = useState(false);

  // State for the new game's company and scenario selections
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);

  /**
   * Handle loading a game - navigate to the game play page
   * @param id - The ID of the game to load
   */
  const handleLoadGame = (id: string) => {
    console.log(`Loading game: ${id}`);
    router.push(`/my-game/play/${id}`);
  };

  /**
   * Show confirmation before deleting a game
   * @param id - The ID of the game to delete
   * @param e - The mouse event
   */
  const handleDeleteGame = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmation(id);
  };

  /**
   * Confirm and execute game deletion
   * @param id - The ID of the game to delete
   */
  const confirmDelete = (id: string) => {
    console.log(`Deleting game: ${id}`);
    // Implement your deletion logic here.
    setDeleteConfirmation(null);
  };

  /**
   * Create a new game with the selected company and scenario
   */
  const handleCreateNewGame = () => {
    // Validate required selections
    if (!selectedCompany || !selectedScenario) {
      console.error("Company and scenario are required");
      return;
    }
    
    // Create a new game object following the Game interface
    const newGame: Game = {
      id: `game_${Date.now()}`,
      company: selectedCompany,
      scenario: selectedScenario,
      userId: "current_user_id", // In a real app, get this from auth context
      day: 0,
      result: "Game started",
      characterList: []
    };
    
    console.log("Creating new game:", newGame);
    
    // In a real app, you would save this to your database
    // For now, we'll navigate to the new game page
    setShowNewGameModal(false);
    router.push(`/my-game/play/${newGame.id}`);
    
    // Reset selections
    setSelectedCompany(null);
    setSelectedScenario(null);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <h1 className="text-2xl font-medium">My Games</h1>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {/* New Game Card */}
              <Card
                className="flex cursor-pointer flex-col justify-between border border-dashed border-muted-foreground/20 bg-background transition-all hover:border-muted-foreground/40 hover:shadow-sm"
                onClick={() => setShowNewGameModal(true)}
              >
                <CardContent className="flex flex-1 flex-col items-center justify-center p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Calendar className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium">New Game</h3>
                  <p className="mt-1 text-center text-sm text-muted-foreground">Start a new scenario</p>
                </CardContent>
                <CardFooter className="p-4">
                  <Button className="w-full" variant="outline">
                    Create
                  </Button>
                </CardFooter>
              </Card>

              {/* Saved Game Cards */}
              {savedGames.map((game) => (
                <Card 
                  key={game.id} 
                  className="cursor-pointer transition-all hover:shadow-sm bg-background"
                  onClick={() => handleLoadGame(game.id)}
                >
                  <CardContent className="p-4">
                    {/* Top row with Company Logo, Name, and Delete Icon */}
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden border border-muted flex-shrink-0">
                          <Image
                            src={game.company.companyProfileURL || "/placeholder.svg"}
                            alt={`${game.company.name} logo`}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                        <h3 className="line-clamp-1 text-lg font-medium">{game.company.name}</h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => handleDeleteGame(game.id, e)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>

                    <p className="line-clamp-2 text-sm text-muted-foreground mb-4">{game.company.description}</p>

                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-sm font-medium">Scenario:</span>
                        <span className="text-sm text-muted-foreground">{game.scenario.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Day {game.day}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full" variant="default" onClick={() => handleLoadGame(game.id)}>
                      Load Game
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
        </main>
      </div>

      {/* Confirm Deletion Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-background border rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-2">Confirm Deletion</h3>
            <p className="text-muted-foreground mb-4">
              Are you sure you want to delete this saved game? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteConfirmation(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => confirmDelete(deleteConfirmation)}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* New Game Modal using shadCN UI selectors */}
      {showNewGameModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-background border rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Create New Game</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowNewGameModal(false)}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Company</Label>
                <CompanySelector selectedCompany={selectedCompany} onCompanySelect={setSelectedCompany} />
              </div>

              <div className="space-y-2">
                <Label>Scenario</Label>
                <ScenarioSelector selectedScenario={selectedScenario} onScenarioSelect={setSelectedScenario} />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowNewGameModal(false)}>
                Cancel
              </Button>
              <Button variant="default" onClick={handleCreateNewGame} disabled={!selectedCompany || !selectedScenario}>
                Create Game
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
