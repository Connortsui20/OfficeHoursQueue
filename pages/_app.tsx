import "../styles/globals.css";
import { Toaster } from "react-hot-toast";

import Navbar from "../components/Navbar";
import useProfile from "../lib/hooks/useProfile";
import { UserContext } from "../lib/context";
import { UserProfile } from "../lib/interfaces";

function MyApp({ Component, pageProps }) {
    const userProfile: UserProfile = useProfile();

    return (
        <UserContext.Provider value={userProfile}>
            <Navbar />
            <Component {...pageProps} />
            <Toaster
                toastOptions={{
                    // Define default options
                    duration: 4000,
                    style: {
                        "text-align": "center",
                        borderRadius: "10px",
                    },
                    // Default options for specific types
                    error: {
                        duration: 6000,
                    },
                }}
            />
        </UserContext.Provider>
    );
}

export default MyApp;
