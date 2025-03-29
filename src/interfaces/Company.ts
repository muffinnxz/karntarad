export interface Company {
	id: string;
	userId: string;
	name: string;
	description: string;
	companyProfileURL: string;
	createdAt: Date;
}

export interface CompanyPostRequest {
	name: string;
	description: string;
	companyProfilePicture: string;
}

export interface CompanyPostResponse {
	company: Company;
}

export interface CompanyGetResponse {
	userCompanies: Company[];
	communityCompanies: Company[];
}
