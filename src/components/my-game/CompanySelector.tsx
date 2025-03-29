"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

// Import the Company interface
import { Company } from "@/interfaces/Company";

interface CompanySelectorProps {
  selectedCompany: Company | null;
  onCompanySelect: (company: Company | null) => void;
}

export default function CompanySelector({ selectedCompany, onCompanySelect }: CompanySelectorProps) {
  // State for new company creation
  const [newCompany, setNewCompany] = useState({
    name: "",
    description: "",
    image: null as File | null
  });

  // Mock data for "My Company" tab
  const mockMyCompanies: Company[] = [
    {
      id: "1",
      userId: "user_1",
      name: "My Company A",
      description: "This is my first company.",
      image: "/placeholder/company-profile.svg"
    },
    {
      id: "2",
      userId: "user_1",
      name: "My Company B",
      description: "This is my second company.",
      image: "/placeholder/company-profile.svg"
    }
  ];

  // Mock data for "Community" tab
  const mockCommunityCompanies: Company[] = [
    {
      id: "3",
      userId: "user_2",
      name: "Community Company X",
      description: "A great community company.",
      image: "/placeholder/company-profile.svg"
    },
    {
      id: "4",
      userId: "user_3",
      name: "Community Company Y",
      description: "Another awesome community company.",
      image: "/placeholder/company-profile.svg"
    }
  ];

  // Handle input changes for new company creation.
  const handleNewCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const files = (e.target as HTMLInputElement).files;
    setNewCompany((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  // Helper: Convert image file to base64 string using canvas.
  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
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

  // Create new company and pass it to parent.
  const handleCreateNewCompany = async () => {
    let base64Image: string | undefined = undefined;
    if (newCompany.image) {
      try {
        base64Image = await convertImageToBase64(newCompany.image);
      } catch (error) {
        console.error("Error converting image:", error);
      }
    }
    // In a real app, generate a unique id and get the actual user id.
    const createdCompany: Company = {
      id: "new_id",
      userId: "current_user_id",
      name: newCompany.name,
      description: newCompany.description,
      image: base64Image
    };
    onCompanySelect(createdCompany);
    setOpen(false); // Close the dialog after creating a new company
  };

  // Function to handle company selection and close dialog
  const [open, setOpen] = useState(false);
  
  const handleSelectCompany = (company: Company) => {
    onCompanySelect(company);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer border p-3 rounded hover:border-primary transition-colors relative">
          {selectedCompany ? (
            <>
              <div className="flex items-center gap-3">
                {selectedCompany.image && (
                  <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                    <img src={selectedCompany.image} alt={selectedCompany.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <div className="font-medium">{selectedCompany.name}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-[200px]">{selectedCompany.description}</div>
                </div>
              </div>
              <button 
                className="absolute top-2 right-2 h-6 w-6 rounded-full bg-muted/80 hover:bg-muted flex items-center justify-center"
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select or Create Company</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="my-company">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="my-company">My Company</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
          </TabsList>
          <TabsContent value="my-company" className="grid grid-cols-1 gap-4 mt-4">
            {mockMyCompanies.map((company) => (
              <Card 
                key={company.id} 
                onClick={() => handleSelectCompany(company)} 
                className={`cursor-pointer hover:border-primary transition-colors ${selectedCompany?.id === company.id ? 'border-primary' : ''}`}
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    {company.image && (
                      <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <img src={company.image} alt={company.name} className="w-full h-full object-cover" />
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
          <TabsContent value="community" className="grid grid-cols-1 gap-4 mt-4">
            {mockCommunityCompanies.map((company) => (
              <Card 
                key={company.id} 
                onClick={() => handleSelectCompany(company)} 
                className={`cursor-pointer hover:border-primary transition-colors ${selectedCompany?.id === company.id ? 'border-primary' : ''}`}
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    {company.image && (
                      <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <img src={company.image} alt={company.name} className="w-full h-full object-cover" />
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
          <TabsContent value="new">
            <div className="space-y-4 p-4">
              <Input name="name" value={newCompany.name} onChange={handleNewCompanyChange} placeholder="Company Name" />
              <Textarea
                name="description"
                value={newCompany.description}
                onChange={handleNewCompanyChange}
                placeholder="Company Description"
                rows={3}
              />
              <Input type="file" name="image" onChange={handleNewCompanyChange} />
              <Button onClick={handleCreateNewCompany}>Create Company</Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
