import axios from "axios";
import admin from "./firebase-admin";
import { v4 as uuidv4 } from "uuid";
const storage = admin.storage();
const bucket = storage.bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
const bucketUrlPath = `https://storage.googleapis.com/${bucket.name}`;

export async function uploadBase64(image: string, path: string) {
  let buffer: Buffer;
  if (image.startsWith("http")) {
    const response = await axios.get(image, {
      responseType: "arraybuffer" // Important for binary data
    });
    if (!response.data) throw new Error("Failed to fetch the image from the URL");
    buffer = Buffer.from(response.data, "binary");
  } else {
    buffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), "base64");
  }
  const blob = bucket.file(path);
  await blob.save(buffer, {
    metadata: {
      contentType: "image/jpeg"
    }
  });
  return `${bucketUrlPath}/${path}`;
}

export async function uploadFileToFirestorage(file: File, folder: string, path: string) {
  const fileBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(fileBuffer);
  const contentType = file.type;
  const blob = bucket.file(`${folder}/${path}`);
  await blob.save(buffer, {
    metadata: {
      contentType: contentType,
      metadata: {
        firebaseStorageDownloadTokens: uuidv4()
      }
    }
  });
  return `${bucketUrlPath}/${folder}/${path}`;
}
