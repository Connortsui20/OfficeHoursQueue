import { addDoc, collection } from "firebase/firestore";

import { firestore } from "../firebase";
import { TAData } from "../interfaces";

/**
 * Creates a TA in the "TAData" collection
 * @async Firestore add
 * @returns A promise containing the auto-generated ID of that document
 * @throws "" (Empty String)
 */
export default async function addTA(): Promise<string> {
    
    const TADataRef = collection(firestore, "TAData");

    const newTA: TAData = {
        meetingsHeld: 0,
        inOffice: false,
        inMeeting: false,
    };

    try {
        const TADoc = await addDoc(TADataRef, newTA);
        return TADoc.id;
    } catch (err) {
        console.error("Error creating a new TA:", err);
        return "";
    }

}
