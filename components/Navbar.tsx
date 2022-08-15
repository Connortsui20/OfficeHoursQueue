import Link from "next/link";
import toast from "react-hot-toast";
import { useState, useEffect, useContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";

import { auth } from "../lib/firebase";
import { UserContext } from "../lib/context";
import { UserProfile, isStudentData } from "../lib/interfaces";

//? https://tailwindui.com/components/application-ui/navigation/navbars

export default function Navbar() {
    const userProfile: UserProfile = useContext(UserContext);
    const [user] = useAuthState(auth);

    const router = useRouter();
    const [onLoginPage, setOnLoginPage] = useState(false);

    useEffect(() => {
        setOnLoginPage(router.pathname === "/login");
    }, [router]);

    const handleLogout = () => {
        // console.log("Logging out");
        toast.promise(signOut(auth), {
            loading: "Logging out...",
            success: `Logged out successfully!\nGoodbye ${user.displayName}!`,
            error: "Could not log out\nPlease contact a staff member",
        });
    };

    return (
        <nav className="bg-blue-600 text-white border-gray-600 border-b-2">
            <div className="flex justify-between items-center h-16">
                <div className="m-8 text-xl">Office Hours Queue</div>
                <div></div> {/* There must be a better way to do this */}
                {/* User is signed-in */}
                {user && (
                    <div className="flex justify-center items-center h-16">
                        <div className="">
                            <Link href="/login">
                                <button
                                    className="bg-gray-100 p-2 rounded-lg text-black hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </Link>
                        </div>

                        {userProfile && (
                            <div className="m-8">
                                <img
                                    className="rounded-full w-8"
                                    src={userProfile.photoURL}
                                    alt="User Photo"
                                />
                            </div>
                        )}
                    </div>
                )}
                {/* User is not signed-in */}
                {!user && !onLoginPage && (
                    <div className="w-24">
                        <Link href="/login">
                            <button className="bg-gray-100 p-2 rounded-lg text-black hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                Login
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
