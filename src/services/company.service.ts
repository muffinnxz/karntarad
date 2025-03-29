import admin from "@/lib/firebase-admin";
import { Company } from "@/interfaces/Company";
import { uploadBase64 } from "@/lib/firebase-storage";

export const createCompany = async (
  userId: string,
  name: string,
  description: string,
  companyProfilePicture?: string,
  isPublic?: boolean,
  username?: string
) => {
  const fs = admin.firestore();
  const companyRef = fs.collection("companies").doc();
  const companyProfileURL = companyProfilePicture
    ? await uploadBase64(companyProfilePicture, `companies/${companyRef.id}`)
    : "";

  const company: Company = {
    id: companyRef.id,
    userId: userId,
    name: name,
    description: description,
    companyProfileURL: companyProfileURL,
    createdAt: new Date(),
    isPublic: isPublic || false,
    username: username || ""
  };

  await companyRef.set(company);
  return company;
};

export const getCompany = async (companyId: string) => {
  const fs = admin.firestore();
  const company = await fs.collection("companies").doc(companyId).get();
  return company.data() as Company;
};

export const getCompaniesByUserId = async (userId: string) => {
  const fs = admin.firestore();
  const companies = await fs.collection("companies").where("userId", "==", userId).get();
  return companies.docs.map((doc) => doc.data() as Company);
};

export const getTenRandomCompanies = async (userId: string) => {
  const fs = admin.firestore();
  const companies = await fs.collection("companies").get();
  const filteredCompanies = companies.docs.filter((doc) => doc.data().userId !== userId && doc.data().isPublic);
  const randomCompanies = filteredCompanies.sort(() => Math.random() - 0.5).slice(0, 10);
  return randomCompanies.map((doc) => doc.data() as Company);
};

export const deleteCompany = async (companyId: string) => {
  const fs = admin.firestore();
  const companyRef = fs.collection("companies").doc(companyId);
  const companySnapshot = await companyRef.get();

  await companyRef.delete();
  return companySnapshot.data();
};

export const updateCompany = async (
  companyId: string,
  name: string,
  description: string,
  companyProfilePicture: string,
  username: string
) => {
  const fs = admin.firestore();

  const randomId = crypto.randomUUID();
  const companyProfileURL = await uploadBase64(companyProfilePicture, `companies/${randomId}`);

  const company = {
    name: name,
    username: username,
    description: description,
    companyProfileURL: companyProfileURL,
    isPublic: true,
    createdAt: new Date()
  };
  await fs.collection("companies").doc(companyId).update(company);
  return company;
};
