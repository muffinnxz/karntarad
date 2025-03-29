"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
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
import { X, Trash2 } from "lucide-react";
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
    description: "",
    isPublic: true
  });

  // State for form errors
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // State for loading
  const [isLoading, setIsLoading] = useState(false);

  // State for scenarios fetched from the API
  const [userScenarios, setUserScenarios] = useState<Scenario[]>([]);
  const [communityScenarios, setCommunityScenarios] = useState<Scenario[]>([]);

  // Fetch scenarios when the dialog opens
  useEffect(() => {
    if (open) {
      axios
        .get("/scenario")
        .then((res) => {
          // API returns userScenarios and communityScenarios
          setUserScenarios(res.data.userScenarios);
          setCommunityScenarios(res.data.communityScenarios);
        })
        .catch((error) => {
          console.error("Error fetching scenarios:", error);
        });
    }
  }, [open]);

  /**
   * Update new scenario state on input change.
   * Also clear errors for the corresponding field.
   */
  const handleNewScenarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    // Clear error for this field
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
    setNewScenario((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  /**
   * Create new scenario via API and pass it to parent.
   * Closes the dialog after successful creation.
   */
  const handleCreateNewScenario = () => {
    // Validate required fields
    const errors: { [key: string]: string } = {};
    if (!newScenario.name) {
      errors.name = "Scenario name is required";
    }
    if (!newScenario.description) {
      errors.description = "Scenario description is required";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);

    axios
      .post("/scenario", {
        name: newScenario.name,
        description: newScenario.description,
        isPublic: Boolean(newScenario.isPublic)
      })
      .then((response) => {
        console.log("Scenario created successfully:", response.data);
        onScenarioSelect(response.data); // Pass the created scenario to the parent component
        setOpen(false); // Close the dialog

        // Reset form and errors
        setNewScenario({
          name: "",
          description: "",
          isPublic: true
        });
        setFormErrors({});
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error creating scenario:", error);
        setIsLoading(false);
      });
  };

  /**
   * Delete a scenario using the API.
   * @param scenarioId - The ID of the scenario to delete.
   */
  const handleDeleteScenario = (scenarioId: string) => {
    axios
      .delete("/scenario", {
        data: { id: scenarioId }
      })
      .then(() => {
        console.log("Scenario deleted successfully");
        // Remove the scenario from the list
        setUserScenarios((prevScenarios) => prevScenarios.filter((scenario) => scenario.id !== scenarioId));

        // If the deleted scenario was selected, clear the selection
        if (selectedScenario?.id === scenarioId) {
          onScenarioSelect(null);
        }
      })
      .catch((error) => {
        console.error("Error deleting scenario:", error);
      });
  };

  /**
   * Handle scenario selection.
   * @param scenario - The selected scenario.
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

          {/* My Scenarios Tab */}
          <TabsContent value="my-scenarios" className="mt-4 grid grid-cols-1 gap-4 max-h-[300px] overflow-y-auto pr-2">
            {userScenarios.map((scenario) => (
              <Card
                key={scenario.id}
                className={`relative cursor-pointer transition-colors hover:border-primary ${
                  selectedScenario?.id === scenario.id ? "border-primary" : ""
                }`}
              >
                <CardHeader onClick={() => handleSelectScenario(scenario)}>
                  <CardTitle>{scenario.name}</CardTitle>
                  <CardDescription className="mt-2">{scenario.description}</CardDescription>
                </CardHeader>
                <button
                  className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Are you sure you want to delete "${scenario.name}"?`)) {
                      handleDeleteScenario(scenario.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete scenario</span>
                </button>
              </Card>
            ))}
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="mt-4 grid grid-cols-1 gap-4 max-h-[300px] overflow-y-auto pr-2">
            {communityScenarios.map((scenario) => (
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

          {/* New Scenario Tab */}
          <TabsContent value="new">
            <div className="p-4">
              {/* Scenario Name */}
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium" htmlFor="scenarioName">
                  Scenario Name <span className="text-destructive">*</span>
                </label>
                <Input
                  id="scenarioName"
                  name="name"
                  value={newScenario.name}
                  onChange={handleNewScenarioChange}
                  placeholder="Enter scenario name"
                  className={formErrors.name ? "border-destructive" : ""}
                />
                {formErrors.name && <p className="text-xs text-destructive mt-1">{formErrors.name}</p>}
              </div>

              {/* Scenario Description */}
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium" htmlFor="scenarioDescription">
                  Scenario Description <span className="text-destructive">*</span>
                </label>
                <Input
                  id="scenarioDescription"
                  name="description"
                  value={newScenario.description}
                  onChange={handleNewScenarioChange}
                  placeholder="Enter scenario description"
                  className={formErrors.description ? "border-destructive" : ""}
                />
                {formErrors.description && <p className="text-xs text-destructive mt-1">{formErrors.description}</p>}
              </div>

              {/* Is Public Checkbox */}
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  name="isPublic"
                  id="isPublic"
                  checked={newScenario.isPublic}
                  onChange={handleNewScenarioChange}
                  className="mr-2"
                />
                <label htmlFor="isPublic" className="text-sm">
                  Make scenario public
                </label>
              </div>

              {/* Create Button */}
              <Button onClick={handleCreateNewScenario} disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Scenario"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
