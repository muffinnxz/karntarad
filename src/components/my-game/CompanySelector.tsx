"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
// Icons
import { X, Trash2, Building2, Plus, Upload, Users } from "lucide-react";
// Types
import { Company } from "@/interfaces/Company";
import axios from "@/lib/axios";

interface CompanySelectorProps {
  selectedCompany: Company | null;
  onCompanySelect: (company: Company | null) => void;
}

export default function CompanySelector({ selectedCompany, onCompanySelect }: CompanySelectorProps) {
  // Dialog open state
  const [open, setOpen] = useState(false);

  // Active tab state
  const [activeTab, setActiveTab] = useState("my-company");

  // State for creating a new company
  const [newCompany, setNewCompany] = useState({
    name: "",
    description: "",
    image: null as File | null,
    isPublic: true,
    username: ""
  });

  // State for image preview URL
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // State for companies fetched from the API
  const [myCompanies, setMyCompanies] = useState<Company[]>([]);
  const [communityCompanies, setCommunityCompanies] = useState<Company[]>([]);

  // State for form errors
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Loading state for company creation and fetching companies
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);

  // Fetch companies when the dialog opens
  useEffect(() => {
    if (open) {
      setIsLoadingCompanies(true);
      axios
        .get("/company")
        .then((res) => {
          // Expecting the API to return an object with userCompanies and communityCompanies
          setMyCompanies(res.data.userCompanies);
          setCommunityCompanies(res.data.communityCompanies);
        })
        .catch((error) => {
          console.error("Error fetching companies:", error);
        })
        .finally(() => {
          setIsLoadingCompanies(false);
        });
    }
  }, [open]);

  /**
   * Update new company state when user types, selects a file, or toggles the checkbox.
   * Also clears error for the field being updated.
   */
  const handleNewCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type, value, checked, files } = e.target as HTMLInputElement;
    // Clear error for this field
    setFormErrors((prev) => ({ ...prev, [name]: "" }));

    if (files && files[0] && name === "image") {
      const file = files[0];
      setPreviewUrl(URL.createObjectURL(file));
      setNewCompany((prev) => ({
        ...prev,
        image: file
      }));
    } else {
      setNewCompany((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  /**
   * Convert image File to a base64 string using a canvas.
   */
  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = document.createElement("img");
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Failed to get canvas context"));
            return;
          }
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL("image/png");
          resolve(dataUrl);
        };
        img.onerror = (error) => reject(error);
        img.src = reader.result as string;
        img.crossOrigin = "anonymous";
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  /**
   * Create a new company object and pass it to the parent component.
   * Closes the dialog after successful creation.
   */
  const handleCreateNewCompany = async () => {
    // Validate required fields
    const errors: { [key: string]: string } = {};
    if (!newCompany.name) {
      errors.name = "Company name is required";
    }
    if (!newCompany.username) {
      errors.username = "Company username is required";
    } else if (!/^[a-z0-9_]+$/.test(newCompany.username)) {
      errors.username = "Username must contain only lowercase letters, numbers, or underscores";
    }
    if (!newCompany.description) {
      errors.description = "Company description is required";
    }
    if (!newCompany.image) {
      errors.image = "Company logo is required";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);

    let base64Image: string | undefined;
    if (newCompany.image) {
      try {
        base64Image = await convertImageToBase64(newCompany.image);
      } catch (error) {
        console.error("Error converting image:", error);
      }
    }

    axios
      .post("/company", {
        name: newCompany.name,
        description: newCompany.description,
        companyProfilePicture: base64Image,
        isPublic: newCompany.isPublic,
        username: newCompany.username
      })
      .then((response) => {
        console.log("Company created successfully:", response.data);
        onCompanySelect(response.data);
        setOpen(false);
        // Reset form, errors, and preview
        setNewCompany({
          name: "",
          description: "",
          image: null,
          isPublic: true,
          username: ""
        });
        setPreviewUrl(null);
        setFormErrors({});
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error creating company:", error);
        setIsLoading(false);
      });
  };

  /**
   * Delete a company using the API.
   */
  const handleDeleteCompany = (companyId: string) => {
    axios
      .delete("/company", {
        data: { id: companyId }
      })
      .then(() => {
        console.log("Company deleted successfully");
        setMyCompanies((prevCompanies) => prevCompanies.filter((company) => company.id !== companyId));
        if (selectedCompany?.id === companyId) {
          onCompanySelect(null);
        }
      })
      .catch((error) => {
        console.error("Error deleting company:", error);
      });
  };

  /**
   * Select a company from the fetched data and close the dialog.
   */
  const handleSelectCompany = (company: Company) => {
    onCompanySelect(company);
    setOpen(false);
  };

  /**
   * Clear the selected image and preview.
   */
  const handleClearImage = () => {
    setNewCompany((prev) => ({ ...prev, image: null }));
    setPreviewUrl(null);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (open) {
          setActiveTab("my-company");
        }
      }}
    >
      {/* Selector trigger */}
      <DialogTrigger asChild>
        <div className="relative flex items-center gap-3 cursor-pointer rounded-lg border border-input bg-background p-4 transition-all hover:border-primary hover:shadow-sm">
          {selectedCompany ? (
            <>
              <div className="flex items-center gap-3 w-full">
                {selectedCompany.companyProfileURL ? (
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border shadow-sm">
                    <Image
                      src={selectedCompany.companyProfileURL || "/placeholder.svg"}
                      alt={selectedCompany.name}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-12 w-12 flex-shrink-0 rounded-md bg-muted flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground truncate">{selectedCompany.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{selectedCompany.description}</div>
                </div>
                <Badge variant="outline" className="ml-auto">
                  {selectedCompany.isPublic ? "Public" : "Private"}
                </Badge>
              </div>
              <button
                className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-muted/80 hover:bg-muted"
                onClick={(e) => {
                  e.stopPropagation();
                  onCompanySelect(null);
                }}
              >
                <X className="h-3 w-3 text-muted-foreground" />
                <span className="sr-only">Clear selection</span>
              </button>
            </>
          ) : (
            <>
              <div className="h-12 w-12 flex-shrink-0 rounded-md bg-muted flex items-center justify-center">
                <Building2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <span className="text-muted-foreground">Select or create a company</span>
            </>
          )}
        </div>
      </DialogTrigger>

      {/* Dialog Content */}
      <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Select or Create Company
          </DialogTitle>
          <DialogDescription>
            Choose one of your companies, pick one from the community, or create a new company.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="my-company" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              My Companies
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Community
            </TabsTrigger>
            <TabsTrigger value="new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Company
            </TabsTrigger>
          </TabsList>

          {/* My Company Tab */}
          <TabsContent value="my-company" className="flex-1 overflow-hidden flex flex-col min-h-0">
            {isLoadingCompanies ? (
              <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                <p className="text-lg">Loading your companies...</p>
              </div>
            ) : myCompanies.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                <Building2 className="h-12 w-12 text-muted-foreground mb-2" />
                <h3 className="font-medium text-lg">No companies yet</h3>
                <p className="text-muted-foreground text-sm mt-1 mb-4">
                  Create your first company to get started, or explore the community companies.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setActiveTab("new")}>
                    Create Company
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab("community")}>
                    Explore Community
                  </Button>
                </div>
              </div>
            ) : (
              <div className="overflow-y-auto pr-2 space-y-4 flex-1">
                {myCompanies.map((company) => (
                  <Card
                    key={company.id}
                    className={`relative transition-all hover:border-primary hover:shadow-sm ${
                      selectedCompany?.id === company.id ? "border-primary ring-1 ring-primary" : ""
                    }`}
                  >
                    <CardContent className="p-4 cursor-pointer" onClick={() => handleSelectCompany(company)}>
                      <div className="flex items-start gap-4">
                        {company.companyProfileURL ? (
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border shadow-sm">
                            <Image
                              src={company.companyProfileURL || "/placeholder.svg"}
                              alt={company.name}
                              width={64}
                              height={64}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-16 w-16 flex-shrink-0 rounded-md bg-muted flex items-center justify-center">
                            <Building2 className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-lg truncate max-w-[75%]">{company.name}</h3>
                            <Badge variant="outline">{company.isPublic ? "Public" : "Private"}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 pr-10 truncate">@{company.username}</p>
                          <p className="text-sm mt-2 line-clamp-none pr-10">{company.description}</p>
                        </div>
                      </div>
                    </CardContent>
                    <button
                      className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Are you sure you want to delete "${company.name}"?`)) {
                          handleDeleteCompany(company.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete company</span>
                    </button>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="flex-1 overflow-hidden flex flex-col min-h-0">
            <div className="overflow-y-auto pr-2 space-y-4 flex-1">
              {communityCompanies.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mb-2" />
                  <h3 className="font-medium text-lg">No community companies</h3>
                  <p className="text-muted-foreground text-sm mt-1">Community companies will appear here</p>
                </div>
              ) : (
                communityCompanies.map((company) => (
                  <Card
                    key={company.id}
                    onClick={() => handleSelectCompany(company)}
                    className={`transition-all hover:border-primary hover:shadow-sm cursor-pointer ${
                      selectedCompany?.id === company.id ? "border-primary ring-1 ring-primary" : ""
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {company.companyProfileURL ? (
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border shadow-sm">
                            <Image
                              src={company.companyProfileURL || "/placeholder.svg"}
                              alt={company.name}
                              width={64}
                              height={64}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-16 w-16 flex-shrink-0 rounded-md bg-muted flex items-center justify-center">
                            <Building2 className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-lg truncate max-w-[75%]">{company.name}</h3>
                            <Badge variant="outline">Public</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 pr-10 truncate">@{company.username}</p>
                          <p className="text-sm mt-2 line-clamp-none pr-10">{company.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* New Company Tab */}
          <TabsContent value="new" className="flex-1 overflow-hidden flex flex-col min-h-0">
            <div className="overflow-y-auto pr-2 space-y-5 flex-1">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="company-name" className="text-sm font-medium">
                      Company Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="company-name"
                      name="name"
                      value={newCompany.name}
                      onChange={handleNewCompanyChange}
                      placeholder="Acme Inc."
                      className={`mt-1.5 ${formErrors.name ? "border-destructive" : ""}`}
                    />
                    {formErrors.name && <p className="text-xs text-destructive mt-1">{formErrors.name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="company-username" className="text-sm font-medium">
                      Username <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative mt-1.5">
                      <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">@</span>
                      <Input
                        id="company-username"
                        name="username"
                        value={newCompany.username}
                        onChange={handleNewCompanyChange}
                        placeholder="acme"
                        className={`pl-7 ${formErrors.username ? "border-destructive" : ""}`}
                      />
                    </div>
                    {formErrors.username && <p className="text-xs text-destructive mt-1">{formErrors.username}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="company-description" className="text-sm font-medium">
                    Company Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="company-description"
                    name="description"
                    value={newCompany.description}
                    onChange={handleNewCompanyChange}
                    placeholder="Briefly describe your company..."
                    rows={3}
                    className={`mt-1.5 resize-none ${formErrors.description ? "border-destructive" : ""}`}
                  />
                  {formErrors.description && <p className="text-xs text-destructive mt-1">{formErrors.description}</p>}
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    Company Logo <span className="text-destructive">*</span>
                  </Label>
                  <div className="mt-1.5">
                    {previewUrl ? (
                      <div className="relative w-32 h-32 rounded-md overflow-hidden border shadow-sm">
                        <Image
                          src={previewUrl || "/placeholder.svg"}
                          alt="Company logo preview"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleClearImage}
                          className="absolute top-1 right-1 bg-background/80 p-1 rounded-full hover:bg-background transition-colors shadow-sm"
                        >
                          <X className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Remove image</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-md h-32 w-full max-w-xs">
                        <label
                          htmlFor="company-logo"
                          className="cursor-pointer text-center p-4 flex flex-col items-center"
                        >
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <span className="text-sm font-medium">Click to upload</span>
                          <span className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG (max. 2MB)</span>
                          <Input
                            type="file"
                            id="company-logo"
                            name="image"
                            onChange={handleNewCompanyChange}
                            accept="image/*"
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                    {formErrors.image && <p className="text-xs text-destructive mt-1">{formErrors.image}</p>}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="company-public"
                    checked={newCompany.isPublic}
                    onCheckedChange={(checked) => {
                      setNewCompany((prev) => ({
                        ...prev,
                        isPublic: checked === true
                      }));
                    }}
                  />
                  <Label htmlFor="company-public" className="text-sm font-medium cursor-pointer">
                    Make company public
                  </Label>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={handleCreateNewCompany} disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? "Creating..." : "Create Company"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
