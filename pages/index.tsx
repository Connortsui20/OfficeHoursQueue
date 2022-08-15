import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import extractAndrewID from "../lib/extractAndrewID";
import { auth } from "../lib/firebase";
import { UserContext } from "../lib/context";
import { UserProfile } from "../lib/interfaces";

//? Citation https://medium.com/nerd-for-tech/lets-deploy-a-next-js-app-with-firebase-hosting-e070b3aecd04

export default function Home() {
    
    const userProfile: UserProfile = useContext(UserContext);
    const [user] = useAuthState(auth);

    const router = useRouter();

    useEffect(() => {
        //TODO figure out something better for home page

        if (user) {
            // const andrewID = extractAndrewID(user.email);
            if (
                userProfile &&
                userProfile.role &&
                userProfile.username &&
                userProfile.id
            ) {
                if (userProfile.role === "Student") {
                    router.push(`/student`);
                } else if (userProfile.role === "TA") {
                    router.push(`/ta`);
                }
            }
        }
    }, [user, userProfile]);

    return (
        <div className="flex justify-center items-center h-screen">
            This is the home page, WIP
        </div>
    );
}
