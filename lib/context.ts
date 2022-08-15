import { createContext } from "react";

import { UserProfile } from "./interfaces";

const userProfile: UserProfile = {
    displayName: "",
    photoURL: "",
    username: "",
    role: "",
    id: "",
};

export const UserContext = createContext(userProfile);
