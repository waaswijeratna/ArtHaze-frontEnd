import { ref, deleteObject } from "firebase/storage";
import { storage } from "@/config/firebaseConfig";

/**
 * Extracts the storage path from a Firebase download URL.
 * Example:
 *  https://firebasestorage.googleapis.com/v0/b/<bucket>/o/posts%2Fimage.png?alt=media&token=...
 * → posts/image.png
 */
function getStoragePathFromUrl(url: string): string | null {
  try {
    const baseUrl = "https://firebasestorage.googleapis.com/v0/b/";
    if (!url.startsWith(baseUrl)) return null;

    const withoutBase = url.replace(baseUrl, "");
    const pathWithToken = withoutBase.split("?")[0]; // remove ?token
    const parts = pathWithToken.split("/o/");
    if (parts.length < 2) return null;

    return decodeURIComponent(parts[1]); // decode %2F → /
  } catch (error) {
    console.error("Error extracting storage path:", error);
    return null;
  }
}

/**
 * Deletes an image from Firebase Storage using its download URL.
 * @param imageUrl Full Firebase Storage download URL
 */
export async function deleteImageFromFirebase(imageUrl: string): Promise<void> {
  try {
    const storagePath = getStoragePathFromUrl(imageUrl);
    if (!storagePath) {
      console.warn("Invalid Firebase image URL:", imageUrl);
      return;
    }

    const imageRef = ref(storage, storagePath);
    await deleteObject(imageRef);
    console.log("Image deleted from Firebase:", storagePath);
  } catch (error) {
    console.error("Failed to delete image from Firebase:", error);
  }
}
