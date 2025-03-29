"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { X } from "lucide-react";

import { Scenario } from "@/interfaces/Scenario";

interface ScenarioSelectorProps {
  selectedScenario: Scenario | null;
  onScenarioSelect: (scenario: Scenario | null) => void;
}

export default function ScenarioSelector({ selectedScenario, onScenarioSelect }: ScenarioSelectorProps) {
  // State for dialog open/close
  const [open, setOpen] = useState(false);
  
  const [newScenario, setNewScenario] = useState({
    scenarioName: "",
    scenarioDescription: ""
  });

  const handleNewScenarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewScenario((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateNewScenario = () => {
    // Replace this with your own creation logic.
    const createdScenario: Scenario = {
      id: "new_scenario",
      userId: "current_user_id", // Add userId property
      name: newScenario.scenarioName,
      description: newScenario.scenarioDescription
    };
    onScenarioSelect(createdScenario);
    setOpen(false); // Close the dialog after creating a new scenario
  };
  
  // Function to handle scenario selection and close dialog
  const handleSelectScenario = (scenario: Scenario) => {
    onScenarioSelect(scenario);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer border p-3 rounded hover:border-primary transition-colors relative">
          {selectedScenario ? (
            <>
              <div>
                <div className="font-medium">{selectedScenario.name}</div>
                <div className="text-xs text-muted-foreground truncate max-w-[200px]">{selectedScenario.description}</div>
              </div>
              <button 
                className="absolute top-2 right-2 h-6 w-6 rounded-full bg-muted/80 hover:bg-muted flex items-center justify-center"
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
        </DialogHeader>
        <Tabs defaultValue="my-scenarios">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="my-scenarios">My Scenarios</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
          </TabsList>
          <TabsContent value="my-scenarios" className="grid grid-cols-1 gap-4 mt-4">
            {/* Render list of user's scenarios */}
            <Card 
              onClick={() =>
                handleSelectScenario({
                  id: "1",
                  userId: "user_1", // Add userId property
                  name: "Existing Scenario 1",
                  description: "Description for scenario 1"
                })
              }
              className={`cursor-pointer hover:border-primary transition-colors ${selectedScenario?.id === "1" ? 'border-primary' : ''}`}
            >
              <CardHeader>
                <CardTitle>Existing Scenario 1</CardTitle>
                <CardDescription className="mt-2">Description for scenario 1</CardDescription>
              </CardHeader>
            </Card>
            <Card 
              onClick={() =>
                handleSelectScenario({
                  id: "2",
                  userId: "user_1", // Add userId property
                  name: "Existing Scenario 2",
                  description: "Description for scenario 2"
                })
              }
              className={`cursor-pointer hover:border-primary transition-colors ${selectedScenario?.id === "2" ? 'border-primary' : ''}`}
            >
              <CardHeader>
                <CardTitle>Existing Scenario 2</CardTitle>
                <CardDescription className="mt-2">Description for scenario 2</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
          <TabsContent value="community" className="grid grid-cols-1 gap-4 mt-4">
            {/* Render list of community scenarios */}
            <Card 
              onClick={() =>
                handleSelectScenario({
                  id: "3",
                  userId: "user_2", // Add userId property
                  name: "Community Scenario",
                  description: "Description for community scenario"
                })
              }
              className={`cursor-pointer hover:border-primary transition-colors ${selectedScenario?.id === "3" ? 'border-primary' : ''}`}
            >
              <CardHeader>
                <CardTitle>Community Scenario</CardTitle>
                <CardDescription className="mt-2">Description for community scenario</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
          <TabsContent value="new">
            <div className="space-y-4 p-4">
              <Input
                name="scenarioName"
                value={newScenario.scenarioName}
                onChange={handleNewScenarioChange}
                placeholder="Scenario Name"
              />
              <Input
                name="scenarioDescription"
                value={newScenario.scenarioDescription}
                onChange={handleNewScenarioChange}
                placeholder="Scenario Description"
              />
              <Button onClick={handleCreateNewScenario}>Create Scenario</Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
