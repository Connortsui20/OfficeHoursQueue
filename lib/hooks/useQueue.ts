import { useState, useEffect } from "react";
import { query, collection, getDocs, onSnapshot } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

import useProfile from "./useProfile";
import { firestore, auth } from "../firebase";
import { QueueItemData, isQueueItemData } from "../interfaces";

/**
 * Custom hook for retrieving all data from the queue collection.
 * Will ignore the initial size document.
 * @returns
 */
export default function useQueue(): QueueItemData[] | null {
    const queueRef = query(collection(firestore, "queue"));
    const userProfile = useProfile();
    const [user] = useAuthState(auth);
    const [queue, setQueue] = useState<QueueItemData[]>(null);

    useEffect(() => {
        console.log("Changing");

        let unsubscribe;

        if (user && userProfile && userProfile.role == "TA") {
            unsubscribe = onSnapshot(queueRef, (queueSnap) => {
                const queueData = queueSnap.docs
                    .map(docToJSON)
                    .filter(removeSize);
                setQueue(queueData);
                // Can track snapshot changes: https://firebase.google.com/docs/firestore/query-data/listen#view_changes_between_snapshots
            });
        } else {
            setQueue(null);
        }

        return unsubscribe;
    }, [user, userProfile]); //! BE CAREFUL WITH USEFFECT DEPENDENCY USERPROFILE

    return queue;
}

/**
 * Filter function for the queue
 * @param doc Takes in the firestore document from the "queue" collection
 * @returns True if the document is a valid queue item docuement and not size
 */
function removeSize(data: object): data is QueueItemData {
    if (!data) {
        return false;
    }
    if ("size" in data) {
        return false; // just the first document removed
    }
    if (isQueueItemData(data)) {
        return true;
    } else {
        console.error(
            "There was an invalid queue item data object in the queue:",
            data
        );
        return false;
    }
}

/**
 * Conversion function for a queue document
 * @param doc Takes in the firestore document from the "queue" collection
 * @returns A valid javascript object with a correct timestamp
 */
function docToJSON(doc): object {
    const data = doc.data();
    if (!data) {
        console.error("Queue document is invalid");
        return null;
    }
    if (!("enqueuedAt" in data)) {
        console.error("enqueuedAt field is not in the queue document");
        return null;
    }
    // needed to convert the firestore timestamp to a javascript object
    return {
        ...data,
        enqueuedAt: data.enqueuedAt.toMillis(),
        email: doc.id,
    };
}
