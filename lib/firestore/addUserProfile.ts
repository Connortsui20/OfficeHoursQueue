import { setDoc, doc } from "firebase/firestore";

import { firestore } from "../firebase";
import { UserProfile } from "../interfaces";

/**
 * Directly adds a profile to the 'profiles' collection
 * @async Firestore add
 * @param {string} email
 * @param {string} displayName
 * @param {string} photoURL
 * @returns A promise containing the user profile document as an object
 * @throws null
 */
export default async function addUserProfile(
    email: string,
    displayName: string,
    photoURL: string
): Promise<Object> {

    const userRef = doc(firestore, "profiles", email);

    const userProfile: UserProfile = {
        displayName,
        photoURL,
        username: "", // leave blank on creation
        role: "",
        id: "",
    };

    try {
        await setDoc(userRef, userProfile);
        return userProfile;
    } catch (err) {
        console.error("Error adding the profile documnet:", err);
        return null;
    }
}
