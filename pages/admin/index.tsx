import toast from "react-hot-toast";
import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";

import addTA from "../../lib/firestore/addTA";
import updateProfile from "../../lib/firestore/updateProfile";
import Loader from "../../components/Loader";
import { auth } from "../../lib/firebase";
import { UserProfile, ProfileEmail } from "../../lib/interfaces";
import { UserContext } from "../../lib/context";

export default function AdminPage() {
    const userProfile: UserProfile = useContext(UserContext);

    const [user] = useAuthState(auth);
    const router = useRouter();

    if (user) {
        return (
            <div>
                <AddTAForm profile={userProfile} email={user.email} />
            </div>
        );
    } else {
        return (
            <div>
                {" "}
                <Loader />{" "}
            </div>
        );
    }
}

function AddTAForm(props: ProfileEmail) {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const submitUsername = async (e) => {
        e.preventDefault();

        if (password !== "password") {
            //TODO make environment variable?
            toast.error(
                "Wrong password\nIf you are not a TA, and we find you tried to hack this, you will be punished."
            );
            return;
        }

        const TAID: string = await addTA();
        const newProfile: UserProfile = {
            // update from client side here
            ...props.profile,
            username: username,
            role: "TA",
            id: TAID,
        };

        // One last check to make sure duplicates don't occur
        if (props.profile.id === "") {
            await updateProfile(newProfile, props.email);
            toast.success("Added TA!");
            setUsername("");
            setPassword("");
        } else {
            toast.error(
                "Student already has a studentData document, please contact a staff member with this message",
                {
                    duration: 4000,
                }
            );
        }
    };

    return (
        //! In the future use material-ui or react-radio-buttons
        <div>
            <h3> Enter your student-facing name </h3>
            <form onSubmit={submitUsername}>
                <input
                    name="username"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value);
                    }}
                />
                <h3> Enter the password</h3>
                <input
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                />
                <button type="submit"> Submit </button>
            </form>
        </div>
    );
}
