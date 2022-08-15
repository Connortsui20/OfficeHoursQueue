import { updateDoc, doc } from "firebase/firestore";

import { firestore } from "../firebase";

/**
 * Updates the user's profile with the given object, querying by email
 * @async Firestore update
 * @param {object} newProfile
 * @param {string} email
 * @returns Undefined
 */
export default async function updateProfile(newProfile: object, email: string) {

    const userRef = doc(firestore, "profiles", email);

    try {
        await updateDoc(userRef, newProfile); // Update a document if it exists
    } catch (err) {
        console.error(err);
    }
}
