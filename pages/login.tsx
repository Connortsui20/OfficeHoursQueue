import toast from "react-hot-toast";
import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";

import addStudent from "../lib/firestore/addStudent";
import updateProfile from "../lib/firestore/updateProfile";
import extractAndrewID from "../lib/extractAndrewID";
import { auth } from "../lib/firebase";
import { googleSignIn } from "../lib/auth";
import { UserContext } from "../lib/context";
import { UserProfile, ProfileEmail } from "../lib/interfaces";

export default function Login() {
    //* Will create a semi-empty User Profile in the "profiles" collection
    //* if the profile does not exist yet
    const userProfile: UserProfile = useContext(UserContext);

    const [user] = useAuthState(auth);
    const router = useRouter();

    const [showForm, setShowForm] = useState<boolean>(false);

    useEffect(() => {
        if (user && userProfile) {
            const andrewID = extractAndrewID(user.email);

            // Only happens after user has set their username
            if (
                userProfile.role === "Student" &&
                userProfile.id &&
                userProfile.username
            ) {
                router.push(`/student`);
            } else if (
                userProfile.role === "TA" &&
                userProfile.id &&
                userProfile.username
            ) {
                router.push(`/ta`);
            } else if (userProfile.role === "") {
                setShowForm(true);
            }
        }
    }, [user, userProfile]);

    return (
        <div className="flex justify-center items-center h-screen">
            {showForm ? (
                <UsernameForm profile={userProfile} email={user.email} />
            ) : (
                <button
                    className="bg-white border p-2 text-black rounded-xl flex justify-center items-center hover:bg-gray-300 shadow-2xl"
                    onClick={googleSignIn}
                >
                    <img
                        className="w-8 m-4 rounded-full"
                        src={"/google.png"}
                        alt="Google Logo"
                    />
                    <p className="mr-4">Sign in with Google</p>
                </button>
            )}
        </div>
    );
}

//* This form will only be used by students
function UsernameForm(props: ProfileEmail) {
    const [username, setUsername] = useState<string>("");

    const submitUsername = async (e) => {
        e.preventDefault();

        console.log("Hello world");

        const studentID: string = await addStudent();
        if (studentID) {
            const newProfile: UserProfile = {
                // update from client side here
                ...props.profile,
                username: username,
                role: "Student", // cannot be TA
                id: studentID,
            };

            // One last check to make sure duplicates don't occur
            if (props.profile.id === "") {
                await updateProfile(newProfile, props.email);
            } else {
                toast.error(
                    "Student already has a studentData document, please contact a staff member with this message",
                    {
                        duration: 4000,
                    }
                );
            }
        } // handle error by doing nothing
    };

    return (
        //! In the future use material-ui or react-radio-buttons
        <div className="bg-white rounded-3xl">
            <div className="text-4xl m-8">
                {" "}
                Enter your first preferred name{" "}
            </div>
            <form className="flex m-8" onSubmit={submitUsername}>
                <input
                    className="flex-auto m-8 shadow-xl border border-black rounded w-2/3 p-4 text-gray-700 text-2xl"
                    name="username"
                    placeholder="John Smith"
                    onChange={(e) => {
                        setUsername(e.target.value);
                    }}
                />
                <button
                    className="flex-auto m-8 bg-blue-600 hover:bg-cyan-400 text-white font-bold px-4 rounded"
                    type="submit"
                >
                    {" "}
                    Submit{" "}
                </button>
            </form>
        </div>
    );
}
