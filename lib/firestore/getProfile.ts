import checkUserExists from "./checkUserExists";
import addUserProfile from "./addUserProfile";
import { UserProfile, isUserProfile } from "../interfaces";

/**
 * Will retrieve the user profile given an email, but if the user does not
 * exist yet in the databse, it will create the new user profile document
 * and return that instead
 * @param {stirng} email
 * @param {stirng} displayName
 * @param {stirng} photoURL
 * @returns A promise containing the user profile document as an object
 * @throws null
 */
export default async function getProfile(
    email: string,
    displayName: string,
    photoURL: string
): Promise<UserProfile> {

    const userProfile: object = await checkUserExists(email);

    if (isUserProfile(userProfile)) {
        return userProfile;
    } else {
        if (!userProfile) {
            // user does not exist yet (null)
            const newProfile: object = await addUserProfile(
                email,
                displayName,
                photoURL
            ); // add the user

            if (isUserProfile(newProfile)) {
                return newProfile;
            } else {
                console.error(
                    "The returned profile does not match the UserProfile Interface. Returning null."
                );
                return null;
            }
        } else {
            console.error(
                "The returned profile does not match the UserProfile Interface. Returning null."
            );
            return null;
        }
    }
}
