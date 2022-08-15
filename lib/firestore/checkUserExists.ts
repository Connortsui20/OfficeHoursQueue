import { getDoc, doc } from "firebase/firestore";

import { firestore } from "../firebase";

/**
 * Queries the "profiles" collection by email
 * @async Firestore query
 * @param {string} email
 * @returns A promise containing the user profile document as an object
 * @throws null
 */
export default async function checkUserExists(email: string): Promise<object> {

    const userRef = doc(firestore, "profiles", email);

    try {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            return null; // this is okay, will pass on to getProfile
        }
    } catch (err) {
        console.error("Error querying the user profile docuemnt", err);
        return null;
    }

}