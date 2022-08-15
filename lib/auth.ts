import toast from "react-hot-toast";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

import { auth } from "./firebase";

/** Sign in with popup & Google as the provider */
const googleProvider = new GoogleAuthProvider();

/** Signs in with a google popup */
export const googleSignIn = async () => {
    await signInWithPopup(auth, googleProvider)
        .then((data) => {
            toast.success(
                `Signed in successfully!\nHello ${data.user.displayName}`
            );
        })
        .catch((error) => {
            console.error("There was an error signing in:", error);
            googleSignOut();
            return null;
        });
};

/** Signs out of the current user's google account */
export const googleSignOut = async () => {
    await signOut(auth)
        .then(() => {
            // console.log("User signed out");
        })
        .catch((error) => {
            console.error("There was an error signing out:", error);
        });
};
