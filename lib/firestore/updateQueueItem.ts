import { updateDoc, doc } from "firebase/firestore";

import { firestore } from "../firebase";

/**
 * Adds a QueueItem to the queue collection
 * @async Firestore update
 * @param {object} item
 * @param {string} email
 * @returns A promise containing True if successful, and False otherwise
 */
export default async function updateQueueItem(
    item: object,
    email: string
): Promise<boolean> {
    
    const queueRef = doc(firestore, "queue", email);

    try {
        await updateDoc(queueRef, item);
        return true;
    } catch (err) {
        console.error("Error adding the profile documnet:", err);
        return false;
    }
}
