"use client";

import type React from "react";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Calendar,
  Trash2,
  TrendingUp,
  BarChart,
  PieChart,
  LineChart,
  Plus,
  Loader2,
  AlertTriangle,
  Clock
} from "lucide-react";
import CompanySelector from "@/components/my-game/CompanySelector";
import ScenarioSelector from "@/components/my-game/ScenarioSelector";
import type { Company } from "@/interfaces/Company";
import type { Scenario } from "@/interfaces/Scenario";
import type { Game } from "@/interfaces/Game";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

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
        setCreatingGame(false);
      });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="rounded-full" asChild>
                <Link href="/">
                  <ArrowLeft className="h-5 w-5" />
                  <span className="sr-only">Back</span>
                </Link>
              </Button>
              <h1 className="text-2xl font-semibold">My Games</h1>
            </div>
          </div>
        </header>

        <main>
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="text-muted-foreground">Loading your games...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex justify-center py-16">
              <div className="flex flex-col items-center gap-4 text-center max-w-md">
                <AlertTriangle className="h-12 w-12 text-destructive opacity-80" />
                <h2 className="text-xl font-medium">Unable to load games</h2>
                <p className="text-muted-foreground">{error}</p>
                <Button variant="outline" onClick={() => window.location.reload()} className="mt-2">
                  Try Again
                </Button>
              </div>
            </div>
          ) : savedGames.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-6 rounded-full bg-primary/10 p-4">
                <Calendar className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-medium mb-2">No games yet</h2>
              <p className="text-muted-foreground max-w-md mb-6">
                Start your marketing journey by creating your first game. Choose a company and scenario to begin.
              </p>
              <Button onClick={() => setShowNewGameModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Game
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <Card
                className="flex cursor-pointer flex-col justify-between border border-dashed bg-muted/30 transition-all hover:border-primary/30 hover:shadow-sm group"
                onClick={() => setShowNewGameModal(true)}
              >
                <div className="flex flex-1 flex-col items-center justify-center p-8">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Plus className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mt-6 text-xl font-medium">New Game</h3>
                  <p className="mt-2 text-center text-sm text-muted-foreground">Start a new marketing scenario</p>
                </div>
              </Card>

              {savedGames.map((game) => (
                <Card
                  key={game.id}
                  className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50 overflow-hidden flex flex-col"
                  onClick={() => handleLoadGame(game.id)}
                >
                  <CardContent className="p-5 flex-1">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {game.company.companyProfileURL ? (
                          <div className="h-12 w-12 rounded-md overflow-hidden border border-muted flex-shrink-0 bg-muted/50">
                            <Image
                              src={game.company.companyProfileURL || "/placeholder.svg"}
                              alt={`${game.company.name} logo`}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded-md border border-muted flex-shrink-0 bg-muted/50 flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <h3 className="line-clamp-1 text-lg font-medium">{game.company.name}</h3>
                          <p className="text-xs text-muted-foreground">@{game.company.username || "company"}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full opacity-60 hover:opacity-100"
                        onClick={(e) => handleDeleteGame(game.id, e)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>

                    <p className="line-clamp-2 text-sm text-muted-foreground mb-4">{game.company.description}</p>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          Scenario
                          <span className="text-sm font-medium">{game.scenario.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 pl-1">{game.scenario.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          <Clock className="h-3 w-3 mr-1" />
                          Day {game.day}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-5 pt-0 mt-auto">
                    <Button className="w-full" variant="default">
                      Continue Game
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmation} onOpenChange={(open) => !open && setDeleteConfirmation(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Game</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this saved game? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirmation && confirmDelete(deleteConfirmation)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* New Game Dialog */}
      <Dialog open={showNewGameModal} onOpenChange={setShowNewGameModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Game</DialogTitle>
            <DialogDescription>Select a company and scenario to start your marketing journey.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <CompanySelector selectedCompany={selectedCompany} onCompanySelect={setSelectedCompany} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scenario">Scenario</Label>
              <ScenarioSelector selectedScenario={selectedScenario} onScenarioSelect={setSelectedScenario} />
            </div>
          </div>

          {(!selectedCompany || !selectedScenario) && (
            <p className="text-xs text-destructive text-center mb-2">
              {!selectedCompany && !selectedScenario
                ? "Both company and scenario are required."
                : !selectedCompany
                ? "Company is required."
                : "Scenario is required."}
            </p>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewGameModal(false)} disabled={creatingGame}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateNewGame}
              disabled={!selectedCompany || !selectedScenario || creatingGame}
              className="min-w-[120px]"
            >
              {creatingGame ? (
                <span className="flex items-center gap-2">
                  <span className="animate-pulse">Preparing</span>
                  <span className="flex">
                    {[TrendingUp, BarChart, PieChart, LineChart].map((Icon, index) => (
                      <Icon
                        key={index}
                        className="h-4 w-4 animate-bounce"
                        style={{
                          animationDelay: `${index * 150}ms`,
                          opacity: 0.8
                        }}
                      />
                    ))}
                  </span>
                </span>
              ) : (
                "Create Game"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Creating Game Overlay */}
      {creatingGame && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <div className="bg-card border rounded-xl shadow-lg p-8 max-w-md w-full mx-4 text-center">
            <div className="relative mb-6 mx-auto w-24 h-24">
              <div className="absolute inset-0 border-t-4 border-primary rounded-full animate-spin"></div>
              <div
                className="absolute inset-2 border-r-4 border-primary/70 rounded-full animate-spin"
                style={{ animationDuration: "1.5s", animationDirection: "reverse" }}
              ></div>
              <div
                className="absolute inset-4 border-b-4 border-primary/50 rounded-full animate-spin"
                style={{ animationDuration: "2s" }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-primary animate-pulse" />
              </div>
            </div>

            <h3 className="text-xl font-medium mb-2">Creating Your Marketing Game</h3>
            <div className="space-y-1 mb-4">
              <p className="text-muted-foreground">Preparing marketing scenarios...</p>
            </div>
            <div className="flex justify-center items-center gap-2 mb-4">
              {[TrendingUp, BarChart, PieChart, LineChart].map((Icon, index) => (
                <Icon
                  key={index}
                  className="h-5 w-5 text-primary animate-bounce"
                  style={{
                    animationDelay: `${index * 150}ms`,
                    opacity: 0.8
                  }}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Get ready to apply your marketing knowledge and make strategic decisions!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
