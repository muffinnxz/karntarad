"use client";

import { useState } from "react";
// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// Icons
import { X } from "lucide-react";
// Types
import { Scenario } from "@/interfaces/Scenario";

interface ScenarioSelectorProps {
  selectedScenario: Scenario | null;
  onScenarioSelect: (scenario: Scenario | null) => void;
}

export default function ScenarioSelector({ selectedScenario, onScenarioSelect }: ScenarioSelectorProps) {
  // State for dialog open/close
  const [open, setOpen] = useState(false);

  // State for new scenario creation
  const [newScenario, setNewScenario] = useState({
    name: "",
    description: ""
  });

  // Define mock data for "My Scenarios" and "Community" tabs
  const mockMyScenarios: Scenario[] = [
    {
      id: "1",
      userId: "user_1",
      name: "Existing Scenario 1",
      description: "Description for scenario 1",
      isPublic: true,
      createdAt: new Date()
    },
    {
      id: "2",
      userId: "user_1",
      name: "Existing Scenario 2",
      description: "Description for scenario 2",
      isPublic: true,
      createdAt: new Date()
    },
    {
      id: "4",
      userId: "user_1",
      name: "Existing Scenario 3",
      description: "Description for scenario 3",
      isPublic: true,
      createdAt: new Date()
    },
    {
      id: "5",
      userId: "user_1",
      name: "Existing Scenario 4",
      description: "Description for scenario 4",
      isPublic: true,
      createdAt: new Date()
    },
    {
      id: "6",
      userId: "user_1",
      name: "Existing Scenario 5",
      description: "Description for scenario 5",
      isPublic: true,
      createdAt: new Date()
    },
    {
      id: "7",
      userId: "user_1",
      name: "Existing Scenario 6",
      description: "Description for scenario 6",
      isPublic: true,
      createdAt: new Date()
    }
  ];

  const mockCommunityScenarios: Scenario[] = [
    {
      id: "3",
      userId: "user_2",
      name: "Community Scenario",
      description: "Description for community scenario",
      isPublic: true,
      createdAt: new Date()
    }
  ];

  /**
   * Update new scenario state on input change.
   * @param e - The input change event
   */
  const handleNewScenarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewScenario((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Create new scenario and pass it to parent.
   * Closes the dialog after successful creation.
   */
  const handleCreateNewScenario = () => {
    // Validate required fields
    if (!newScenario.name || !newScenario.description) {
      console.error("Scenario name and description are required");
      return;
    }
    
    // Create new scenario with unique ID
    const createdScenario: Scenario = {
      id: `new_${Date.now()}`,
      userId: "current_user_id",
      name: newScenario.name,
      description: newScenario.description,
      isPublic: true,
      createdAt: new Date()
    };
    
    onScenarioSelect(createdScenario);
    setOpen(false); // Close the dialog after creating a new scenario
    
    // Reset form
    setNewScenario({
      name: "",
      description: ""
    });
  };

  /**
   * Handle scenario selection from mock data.
   * @param scenario - The selected scenario
   */
  const handleSelectScenario = (scenario: Scenario) => {
    onScenarioSelect(scenario);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative cursor-pointer rounded border p-3 transition-colors hover:border-primary">
          {selectedScenario ? (
            <>
              <div>
                <div className="font-medium">{selectedScenario.name}</div>
                <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                  {selectedScenario.description}
                </div>
              </div>
              <button
                className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-muted/80 hover:bg-muted"
                onClick={(e) => {
                  e.stopPropagation();
                  onScenarioSelect(null);
                }}
              >
                <X className="h-3 w-3 text-muted-foreground" />
                <span className="sr-only">Clear selection</span>
              </button>
            </>
          ) : (
            "Select or create a scenario"
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select or Create Scenario</DialogTitle>
          <DialogDescription>
            Choose one of your scenarios, select a community scenario, or create a new one.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="my-scenarios">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="my-scenarios">My Scenarios</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
          </TabsList>
          <TabsContent value="my-scenarios" className="mt-4 grid grid-cols-1 gap-4 max-h-[300px] overflow-y-auto pr-2">
            {mockMyScenarios.map((scenario) => (
              <Card
                key={scenario.id}
                onClick={() => handleSelectScenario(scenario)}
                className={`cursor-pointer transition-colors hover:border-primary ${
                  selectedScenario?.id === scenario.id ? "border-primary" : ""
                }`}
              >
                <CardHeader>
                  <CardTitle>{scenario.name}</CardTitle>
                  <CardDescription className="mt-2">{scenario.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="community" className="mt-4 grid grid-cols-1 gap-4 max-h-[300px] overflow-y-auto pr-2">
            {mockCommunityScenarios.map((scenario) => (
              <Card
                key={scenario.id}
                onClick={() => handleSelectScenario(scenario)}
                className={`cursor-pointer transition-colors hover:border-primary ${
                  selectedScenario?.id === scenario.id ? "border-primary" : ""
                }`}
              >
                <CardHeader>
                  <CardTitle>{scenario.name}</CardTitle>
                  <CardDescription className="mt-2">{scenario.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="new">
            <div className="p-4">
              <div className="mb-4">
                <Input
                  name="name"
                  value={newScenario.name}
                  onChange={handleNewScenarioChange}
                  placeholder="Scenario Name"
                />
              </div>
              <div className="mb-4">
                <Input
                  name="description"
                  value={newScenario.description}
                  onChange={handleNewScenarioChange}
                  placeholder="Scenario Description"
                />
              </div>
              <Button onClick={handleCreateNewScenario}>Create Scenario</Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
