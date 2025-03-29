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
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// Icons
import { X } from "lucide-react";
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

  // State for creating a new company
  const [newCompany, setNewCompany] = useState({
    name: "",
    description: "",
    image: null as File | null,
    isPublic: true
  });

  // State for companies fetched from the API
  const [myCompanies, setMyCompanies] = useState<Company[]>([]);
  const [communityCompanies, setCommunityCompanies] = useState<Company[]>([]);

  // Fetch companies when the dialog opens
  useEffect(() => {
    if (open) {
      axios
        .get("/company")
        .then((res) => {
          // Expecting the API to return an object with userCompanies and communityCompanies
          setMyCompanies(res.data.userCompanies);
          setCommunityCompanies(res.data.communityCompanies);
        })
        .catch((error) => {
          console.error("Error fetching companies:", error);
        });
    }
  }, [open]);

  /**
   * Update new company state when user types, selects a file, or toggles the checkbox.
   * @param e - The input change event
   */
  const handleNewCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type, value, checked, files } = e.target as HTMLInputElement;
    setNewCompany((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : files ? files[0] : value
    }));
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
    if (!newCompany.name || !newCompany.description) {
      console.error("Company name and description are required");
      return;
    }

    let base64Image: string | undefined;
    if (newCompany.image) {
      try {
        base64Image = await convertImageToBase64(newCompany.image);
      } catch (error) {
        console.error("Error converting image:", error);
      }
    }

    // In a real app, generate a unique ID and retrieve the actual user ID.
    const createdCompany: Company = {
      id: `new_${Date.now()}`,
      userId: "current_user_id",
      name: newCompany.name,
      description: newCompany.description,
      companyProfileURL: base64Image || "/placeholder/company-profile.svg",
      isPublic: newCompany.isPublic,
      createdAt: new Date()
    };

    axios
      .post("/company", {
        name: newCompany.name,
        description: newCompany.description,
        companyProfilePicture: base64Image,
        isPublic: newCompany.isPublic
      })
      .then((response) => {
        console.log("Company created successfully:", response.data);
        onCompanySelect(response.data); // Pass the created company to the parent component
        setOpen(false); // Close the dialog
        // Reset form
        setNewCompany({
          name: "",
          description: "",
          image: null,
          isPublic: true
        });
      })
      .catch((error) => {
        console.error("Error creating company:", error);
      });
  };

  /**
   * Select a company from the fetched data and close the dialog.
   */
  const handleSelectCompany = (company: Company) => {
    onCompanySelect(company);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Pseudo-input that triggers the dialog */}
      <DialogTrigger asChild>
        <div className="relative cursor-pointer rounded border p-3 transition-colors hover:border-primary">
          {selectedCompany ? (
            <>
              <div className="flex items-center gap-3">
                {selectedCompany.companyProfileURL && (
                  <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={selectedCompany.companyProfileURL}
                      alt={selectedCompany.name}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <div className="font-medium">{selectedCompany.name}</div>
                  <div className="max-w-[200px] truncate text-xs text-muted-foreground">
                    {selectedCompany.description}
                  </div>
                </div>
              </div>
              {/* Clear Selection Button */}
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
            "Select or create a company"
          )}
        </div>
      </DialogTrigger>

      {/* Dialog Content */}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select or Create Company</DialogTitle>
          <DialogDescription>
            Choose one of your companies, pick one from the community, or create a new company.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="my-company">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="my-company">My Company</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
          </TabsList>

          {/* My Company Tab */}
          <TabsContent value="my-company" className="mt-4 grid grid-cols-1 gap-4 max-h-[300px] overflow-y-auto pr-2">
            {myCompanies.map((company) => (
              <Card
                key={company.id}
                onClick={() => handleSelectCompany(company)}
                className={`cursor-pointer transition-colors hover:border-primary ${
                  selectedCompany?.id === company.id ? "border-primary" : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    {company.companyProfileURL && (
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={company.companyProfileURL}
                          alt={company.name}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <CardTitle>{company.name}</CardTitle>
                      <CardDescription className="mt-2">{company.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="mt-4 grid grid-cols-1 gap-4 max-h-[300px] overflow-y-auto pr-2">
            {communityCompanies.map((company) => (
              <Card
                key={company.id}
                onClick={() => handleSelectCompany(company)}
                className={`cursor-pointer transition-colors hover:border-primary ${
                  selectedCompany?.id === company.id ? "border-primary" : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    {company.companyProfileURL && (
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={company.companyProfileURL}
                          alt={company.name}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <CardTitle>{company.name}</CardTitle>
                      <CardDescription className="mt-2">{company.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </TabsContent>

          {/* New Company Tab */}
          <TabsContent value="new">
            <div className="p-4">
              <div className="mb-4">
                <Input
                  name="name"
                  value={newCompany.name}
                  onChange={handleNewCompanyChange}
                  placeholder="Company Name"
                />
              </div>
              <div className="mb-4">
                <Textarea
                  name="description"
                  value={newCompany.description}
                  onChange={handleNewCompanyChange}
                  placeholder="Company Description"
                  rows={3}
                />
              </div>
              <div className="mb-4">
                <Input type="file" name="image" onChange={handleNewCompanyChange} />
              </div>
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  name="isPublic"
                  id="isPublic"
                  checked={newCompany.isPublic}
                  onChange={handleNewCompanyChange}
                />
                <label htmlFor="isPublic" className="ml-2">
                  Make company public
                </label>
              </div>
              <Button onClick={handleCreateNewCompany}>Create Company</Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
