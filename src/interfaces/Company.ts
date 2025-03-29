export interface Company {
  id: string;
  userId: string;
  name: string;
  username: string;
  description: string;
  companyProfileURL: string;
  isPublic: boolean;
  createdAt: Date;
}

export interface CompanyPostRequest {
  name: string;
  description: string;
  companyProfilePicture: string;
  isPublic: boolean;
}

export interface CompanyPostResponse {
  company: Company;
}

export interface CompanyGetResponse {
  userCompanies: Company[];
  communityCompanies: Company[];
}
