"use client";

import type React from "react";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";
// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
// Icons
import { X, Trash2, FileText, Plus, Users } from "lucide-react";
// Types
import type { Scenario } from "@/interfaces/Scenario";

interface ScenarioSelectorProps {
  selectedScenario: Scenario | null;
  onScenarioSelect: (scenario: Scenario | null) => void;
}

export default function ScenarioSelector({ selectedScenario, onScenarioSelect }: ScenarioSelectorProps) {
  // State for dialog open/close
  const [open, setOpen] = useState(false);

  // Active tab state
  const [activeTab, setActiveTab] = useState("my-scenarios");

  // State for new scenario creation
  const [newScenario, setNewScenario] = useState({
    name: "",
    description: "",
    isPublic: true
  });

  // State for form errors
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // State for loading scenario creation
  const [isLoading, setIsLoading] = useState(false);

  // New state for loading scenarios when fetching from the API
  const [isLoadingScenarios, setIsLoadingScenarios] = useState(false);

  // State for scenarios fetched from the API
  const [userScenarios, setUserScenarios] = useState<Scenario[]>([]);
  const [communityScenarios, setCommunityScenarios] = useState<Scenario[]>([]);

  // Fetch scenarios when the dialog opens
  useEffect(() => {
    if (open) {
      setIsLoadingScenarios(true);
      axios
        .get("/scenario")
        .then((res) => {
          // API returns userScenarios and communityScenarios
          setUserScenarios(res.data.userScenarios);
          setCommunityScenarios(res.data.communityScenarios);
        })
        .catch((error) => {
          console.error("Error fetching scenarios:", error);
        })
        .finally(() => {
          setIsLoadingScenarios(false);
        });
    }
  }, [open]);

  /**
   * Update new scenario state on input change.
   * Also clear errors for the corresponding field.
   */
  const handleNewScenarioChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type, value, checked } = e.target as HTMLInputElement;
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
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (open) {
          setActiveTab("my-scenarios");
        }
      }}
    >
      <DialogTrigger asChild>
        <div className="relative flex items-center gap-3 cursor-pointer rounded-lg border border-input bg-background p-4 transition-all hover:border-primary hover:shadow-sm">
          {selectedScenario ? (
            <>
              <div className="flex items-center gap-3 w-full">
                <div className="h-12 w-12 flex-shrink-0 rounded-md bg-muted flex items-center justify-center">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground truncate">{selectedScenario.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{selectedScenario.description}</div>
                </div>
                <Badge variant="outline" className="ml-auto">
                  {selectedScenario.isPublic ? "Public" : "Private"}
                </Badge>
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
            <>
              <div className="h-12 w-12 flex-shrink-0 rounded-md bg-muted flex items-center justify-center">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <span className="text-muted-foreground">Select or create a scenario</span>
            </>
          )}
        </div>
      </DialogTrigger>

      {/* Dialog Content */}
      <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Select or Create Scenario
          </DialogTitle>
          <DialogDescription>
            Choose one of your scenarios, select a community scenario, or create a new one.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="my-scenarios" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              My Scenarios
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Community
            </TabsTrigger>
            <TabsTrigger value="new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Scenario
            </TabsTrigger>
          </TabsList>

          {/* My Scenarios Tab */}
          <TabsContent value="my-scenarios" className="flex-1 overflow-y-auto flex flex-col min-h-0">
            {isLoadingScenarios ? (
              <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                <p className="text-lg">Loading your scenarios...</p>
              </div>
            ) : userScenarios.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-2" />
                <h3 className="font-medium text-lg">No scenarios yet</h3>
                <p className="text-muted-foreground text-sm mt-1 mb-4">
                  Create your first scenario to get started, or explore community scenarios.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setActiveTab("new")}>
                    Create Scenario
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab("community")}>
                    Explore Community
                  </Button>
                </div>
              </div>
            ) : (
              userScenarios.map((scenario) => (
                <Card
                  key={scenario.id}
                  className={`relative transition-all hover:border-primary hover:shadow-sm ${
                    selectedScenario?.id === scenario.id ? "border-primary ring-1 ring-primary" : ""
                  }`}
                >
                  <CardContent className="p-4 cursor-pointer" onClick={() => handleSelectScenario(scenario)}>
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 flex-shrink-0 rounded-md bg-muted flex items-center justify-center">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-lg truncate max-w-[75%]">{scenario.name}</h3>
                          <Badge variant="outline">{scenario.isPublic ? "Public" : "Private"}</Badge>
                        </div>
                        <p className="text-sm mt-2 line-clamp-none pr-10">{scenario.description}</p>
                      </div>
                    </div>
                  </CardContent>
                  <button
                    className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
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
              ))
            )}
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="flex-1 overflow-hidden flex flex-col min-h-0">
            <div className="overflow-y-auto pr-2 space-y-4 flex-1">
              {communityScenarios.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mb-2" />
                  <h3 className="font-medium text-lg">No community scenarios</h3>
                  <p className="text-muted-foreground text-sm mt-1">Community scenarios will appear here</p>
                </div>
              ) : (
                communityScenarios.map((scenario) => (
                  <Card
                    key={scenario.id}
                    onClick={() => handleSelectScenario(scenario)}
                    className={`transition-all hover:border-primary hover:shadow-sm cursor-pointer ${
                      selectedScenario?.id === scenario.id ? "border-primary ring-1 ring-primary" : ""
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 flex-shrink-0 rounded-md bg-muted flex items-center justify-center">
                          <FileText className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-lg truncate max-w-[75%]">{scenario.name}</h3>
                            <Badge variant="outline">Public</Badge>
                          </div>
                          <p className="text-sm mt-2 line-clamp-none pr-10">{scenario.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* New Scenario Tab */}
          <TabsContent value="new" className="flex-1 overflow-hidden flex flex-col min-h-0">
            <div className="overflow-y-auto pr-2 space-y-5 flex-1">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="scenario-name" className="text-sm font-medium">
                    Scenario Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="scenario-name"
                    name="name"
                    value={newScenario.name}
                    onChange={handleNewScenarioChange}
                    placeholder="Enter scenario name"
                    className={`mt-1.5 ${formErrors.name ? "border-destructive" : ""}`}
                  />
                  {formErrors.name && <p className="text-xs text-destructive mt-1">{formErrors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="scenario-description" className="text-sm font-medium">
                    Scenario Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="scenario-description"
                    name="description"
                    value={newScenario.description}
                    onChange={handleNewScenarioChange}
                    placeholder="Describe your scenario..."
                    rows={3}
                    className={`mt-1.5 resize-none ${formErrors.description ? "border-destructive" : ""}`}
                  />
                  {formErrors.description && <p className="text-xs text-destructive mt-1">{formErrors.description}</p>}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="scenario-public"
                    checked={newScenario.isPublic}
                    onCheckedChange={(checked) => {
                      setNewScenario((prev) => ({
                        ...prev,
                        isPublic: checked === true
                      }));
                    }}
                  />
                  <Label htmlFor="scenario-public" className="text-sm font-medium cursor-pointer">
                    Make scenario public
                  </Label>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={handleCreateNewScenario} disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? "Creating..." : "Create Scenario"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
