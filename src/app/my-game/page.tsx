"use client";

import React, { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calendar, Trash2, X } from "lucide-react";
import CompanySelector from "@/components/my-game/CompanySelector";
import ScenarioSelector from "@/components/my-game/ScenarioSelector";
import { Company } from "@/interfaces/Company";
import { Scenario } from "@/interfaces/Scenario";
import { Game } from "@/interfaces/Game";

export default function LoadGameScreen() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  const [showNewGameModal, setShowNewGameModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [savedGames, setSavedGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New state to track game creation loading
  const [creatingGame, setCreatingGame] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/signin");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (authLoading) return;

    const fetchGames = () => {
      setLoading(true);
      setError(null);

      axios
        .get("/game")
        .then((response) => {
          setSavedGames(response.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching games:", err);
          if (err.response?.status === 401) {
            if (user) {
              setTimeout(fetchGames, 1000);
            } else {
              setError("You need to be logged in to view your games.");
              setLoading(false);
            }
          } else {
            setError("Failed to load games. Please try again later.");
            setLoading(false);
          }
        });
    };

    fetchGames();
  }, [authLoading, user]);

  const handleLoadGame = (id: string) => {
    console.log(`Loading game: ${id}`);
    router.push(`/game/${id}`);
  };

  const handleDeleteGame = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmation(id);
  };

  const confirmDelete = (id: string) => {
    axios
      .delete("/game", { data: { gameId: id } })
      .then(() => {
        console.log(`Game ${id} deleted successfully`);
        setSavedGames((prevGames) => prevGames.filter((game) => game.id !== id));
        setDeleteConfirmation(null);
      })
      .catch((error) => {
        console.error("Error deleting game:", error);
        if (error.response?.status === 401) {
          router.push("/signin");
        }
      });
  };

  const handleCreateNewGame = () => {
    if (!selectedCompany || !selectedScenario) {
      console.error("Company and scenario are required");
      return;
    }

    // Set loading state to true
    setCreatingGame(true);

    axios
      .post("/game", {
        companyId: selectedCompany.id,
        scenarioId: selectedScenario.id
      })
      .then((response) => {
        console.log("Game created successfully:", response.data);
        setShowNewGameModal(false);
        router.push(`/game/${response.data.id}`);
        setSelectedCompany(null);
        setSelectedScenario(null);
      })
      .catch((error) => {
        console.error("Error creating game:", error);
        if (error.response?.status === 401) {
          router.push("/signin");
        }
      })
      .finally(() => {
        // Reset loading state
        setCreatingGame(false);
      });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center">
        <p className="text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center">
        <p className="text-muted-foreground">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
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

        <main>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Card
              className="flex cursor-pointer flex-col justify-between border border-dashed border-muted-foreground/20 bg-background transition-all hover:border-muted-foreground/40 hover:shadow-sm"
              onClick={() => setShowNewGameModal(true)}
            >
              <div className="flex flex-1 flex-col items-center justify-center p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-medium">New Game</h3>
                <p className="mt-1 text-center text-sm text-muted-foreground">Start a new scenario</p>
              </div>
              <div className="p-4">
                <Button className="w-full" variant="outline">
                  Create
                </Button>
              </div>
            </Card>

            {loading && (
              <div className="col-span-full flex justify-center py-12">
                <p className="text-muted-foreground">Loading your games...</p>
              </div>
            )}

            {error && (
              <div className="col-span-full flex justify-center py-12">
                <p className="text-destructive">{error}</p>
              </div>
            )}

            {!loading &&
              savedGames.map((game) => (
                <Card
                  key={game.id}
                  className="cursor-pointer transition-all hover:shadow-sm bg-background"
                  onClick={() => handleLoadGame(game.id)}
                >
                  <CardContent className="p-4">
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
              <Button
                variant="default"
                onClick={handleCreateNewGame}
                disabled={!selectedCompany || !selectedScenario || creatingGame}
              >
                {creatingGame ? "Creating..." : "Create Game"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
