import admin from "@/lib/firebase-admin";
import { DocumentData, DocumentSnapshot } from "@google-cloud/firestore";
import { User } from "@/interfaces/User";


export const getUser = async (userId: string): Promise<DocumentSnapshot<DocumentData, DocumentData>> => {
	const fs = admin.firestore();
	const userRef = fs.collection("users").doc(userId);
	const user = await userRef.get();
	return user;
};

export const createUser = async (
	userId: string,
	name: string,
): Promise<User | null> => {
	try {
		const fs = admin.firestore();
		const userRef = fs.collection("users").doc(userId);

		const user: User = {
			id: userId,
			name: name,
		};

		await userRef.set(user);
		return user;
	} catch (error) {
		console.error("Error adding user: ", error);
		return null;
	}
};
