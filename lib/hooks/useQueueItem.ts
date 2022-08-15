import { useState, useEffect, useMemo } from "react";
import { doc, onSnapshot } from "firebase/firestore";

import { firestore } from "../firebase";
import { QueueItem, isQueueItem } from "../interfaces";

/**
 * Custom hook that retrieves the queue item belonging to a specific student
 * @param {string | undefined} email Querying by student email
 * @returns A QueueItem object representing a queue document, or null
 */
export default function useQueueItem(email: string | undefined): QueueItem {

    const [queueItem, setQueueItem] = useState<QueueItem>(null);

    useEffect(() => {
        let unsubscribe;

        if (email) {
            unsubscribe = onSnapshot(
                doc(firestore, "queue", email),
                (document) => {
                    if (document.exists()) {
                        const data = document.data();
                        if (isQueueItem(data)) {
                            setQueueItem(data);
                        } else {
                            console.error("queueItem document is not valid");
                            setQueueItem(null);
                        }
                    } else {
                        // queue item does not exist yet
                        setQueueItem(null);
                    }
                }
            );
        } else {
            setQueueItem(null);
        }

        return unsubscribe;
    }, [email]);

    return queueItem;
}
