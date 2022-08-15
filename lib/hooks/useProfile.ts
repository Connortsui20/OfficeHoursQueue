import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, onSnapshot } from "firebase/firestore";

import getProfile from "../firestore/getProfile";
import { firestore, auth } from "../firebase";
import { googleSignOut } from "../auth";
import { UserProfile, isUserProfile } from "../interfaces";

/**
 * Custom hook to get the user profile context for the logged in user
 * @returns A UserProfile object, null if not available
 */
export default function useProfile(): UserProfile {

    const [user] = useAuthState(auth);
    const [profile, setProfile] = useState<UserProfile>(null);

    useEffect(() => {
        let unsubscribe;

        if (user) {
            if (!isValidEmail(user.email)) {
                toast.error(
                    "Invalid email address, must end in @andrew.cmu.edu"
                );
                return unsubscribe;
            }
            unsubscribe = onSnapshot(
                doc(firestore, "profiles", user.email),
                (document) => {
                    if (document.exists()) {
                        const profile = document.data();
                        if (isUserProfile(profile)) {
                            setProfile(profile);
                        } else {
                            console.error("Invalid profile");
                            setProfile(null);
                        }
                    } else {
                        // the document does not exist yet
                        (async () => {
                            //! Async wrapper
                            const userProfile: UserProfile =
                                await retrieveUserProfile(user);
                            setProfile(userProfile);
                        })();
                    }
                }
            );
        } else {
            setProfile(null);
        }

        return unsubscribe;
    }, [user]);

    return profile;
}

/**
 * Retrieves the data using getProfile,
 * and also checks if a username and role has been assigned
 * @param {object} user
 * @returns A promise containing the profile document as a UserProfile object
 */
async function retrieveUserProfile(user): Promise<UserProfile> {
    if (!isValidEmail(user.email)) {
        console.error(
            `${user.email} is not valid! Must end in '@andrew.cmu.edu' or '@gmail.com'. Returning null.`
        );
        return null;
    }
    const userProfile: UserProfile = await getProfile(
        user.email,
        user.displayName,
        user.photoURL
    );
    if (!userProfile) {
        console.error("There was an error retreiving a profile. Logging out");
        googleSignOut();
        return null;
    } else {
        return userProfile;
    }
}

/** //! Change for production
 * Returns true if the email domain is @andrew.cmu.edu or @gmail.com
 * @param {string} email
 * @returns True if the email is valid, false otherwise
 */
function isValidEmail(email: string): boolean {
    if (!email.includes("@")) {
        return false;
    }
    const parts = email.split("@");
    if (parts.length !== 2) {
        return false;
    }
    if (parts[1] !== "andrew.cmu.edu" && parts[1] !== "gmail.com") {
        return false;
    }
    return true;
}
